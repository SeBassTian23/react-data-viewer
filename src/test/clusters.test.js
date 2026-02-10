import { describe, it, expect } from 'vitest'

import determineBestK from '../utils/clustering/kmeans'

import reviveSpecialNumbers from './reviveSpecialNumbers'

import rawResults from '../../fixtures/test_data_cluster.json'

const results = reviveSpecialNumbers(structuredClone(rawResults));

describe('Clusters - Cross-language validation', () => {

  describe('kmeans', () => {
    if (results?.kmeans)
      Object.entries(results.kmeans).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = determineBestK(input.data, {
              kMin: 2,
              kMax: 10,
              runsPerK: 30,
              minSilhouette: 0.25,
              maxIterations: 100,
              initialization: 'kmeans++'
            })
          expect(jsResult.best.k).toBeCloseTo(pythonResult.best.k, 5)
          expect(jsResult.best.error).toBeCloseTo(pythonResult.best.error, 5)
          expect(jsResult.best.silhouette).toBeCloseTo(pythonResult.best.silhouette, 5)
        })
      })
  })
})
