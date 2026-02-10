import determineBestK from '../utils/clustering/kmeans'

const handlers = {
  kmeans: async (payload, taskId) => {

    // Run Task
    const { best, allResults } = determineBestK(payload.data, {
      kMin: payload.kMin,
      kMax: payload.kMax,
      runsPerK: payload.runsPerK,
      minSilhouette: payload.minSilhouette,
      maxIterations: payload.maxIterations,
      initialization: payload.initialization,
      // Progress Updates
      onProgress: (progress) => sendProgress(taskId, progress)
    })
    
    // Check if task was terminated
    if (activeTasks.get(taskId)?.terminated) {
      return { success: false, error: 'Task terminated' }
    }

    return { success: true, result: { best, allResults } }
  },
  test: async (payload, taskId) => {

    let i;

    for(i=0;i<payload.counter; i++){
      await delay(500)
      console.log(taskId, i)
      sendProgress(taskId, i);
    
      // Check if task was terminated
      if (activeTasks.get(taskId)?.terminated) {
        return { success: false, error: 'Task terminated' }
      }
    }

    return { success: true, result: i }
  },
}

// Listen for messages from main thread
self.onmessage = async (event) => {
  const { id, task, payload, action } = event.data

  try {
    // Handle termination requests
    if (action === 'terminate') {
      const activeTask = activeTasks.get(id)
      if (activeTask) {
        activeTask.terminated = true
        self.postMessage({
          id,
          success: true,
          message: `Task ${id} marked for termination`
        })
      } else {
        self.postMessage({
          id,
          success: false,
          error: `No active task with id: ${id}`
        })
      }
      return
    }

    // Capture unknown tasks
    if (!handlers[task]) {
      self.postMessage({
        id,
        success: false,
        error: `Unknown task: ${task}`,
      })
      return
    }

    // Register the task as active
    activeTasks.set(id, { terminated: false })

    const result = await handlers[task](payload, id)

    // Clean up the task
    activeTasks.delete(id)

    self.postMessage({ id, ...result })
  } catch (error) {
    activeTasks.delete(id)
    self.postMessage({
      id,
      success: false,
      error: error.message,
    })
  }
}

// Track active tasks
const activeTasks = new Map()

// Send Progess Updates
const sendProgress = (taskId, data) => {
  self.postMessage({
    id: taskId,
    isUpdate: true,
    result: data
  })
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))