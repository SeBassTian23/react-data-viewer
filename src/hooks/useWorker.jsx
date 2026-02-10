// ============================================================================
// useWorker.js - React hook to interact with the worker
// ============================================================================

import { useEffect, useRef, useCallback } from 'react'

import Worker from '../workers/worker.js?worker';

export function useWorker() {
  const workerRef = useRef(null)
  const requestsRef = useRef(new Map())
  const requestIdRef = useRef(0)

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(); // Adjust path as needed

    // Handle messages from worker
    workerRef.current.onmessage = (event) => {
      const { id, success, result, error, isUpdate, message } = event.data
      const request = requestsRef.current.get(id)

      if (request) {
        if (isUpdate) {
          // This is an intermediate progress update
          if (request.onProgress) {
            request.onProgress(result)
          }
        } else {
          // This is the final result
          if (success) {
            request.resolve(result)
          } else {
            request.reject(new Error(error || message))
          }
          requestsRef.current.delete(id)
        }
      }
    }

    return () => {
      workerRef.current.terminate()
    }
  }, [])

  const execute = useCallback(
    (task, payload, options = {}) => {
      const { onProgress, timeout = 300000 } = options

      const id = requestIdRef.current++
      const resultPromise = new Promise((resolve, reject) => {
        requestsRef.current.set(id, { resolve, reject, onProgress })

        workerRef.current.postMessage({ id, task, payload })

        // Timeout after specified duration (default 30 seconds)
        setTimeout(() => {
          if (requestsRef.current.has(id)) {
            requestsRef.current.delete(id)
            reject(new Error(`Worker task "${task}" timed out`))
          }
        }, timeout)
      })

      return {
        taskId: id,
        result: resultPromise
      }
    },
    []
  )

  const terminate = useCallback(
    (taskId) => {
      if (workerRef.current) {
        workerRef.current.postMessage({ id: taskId, action: 'terminate' })
      }
    },
    []
  )

  return { execute, terminate }
}
