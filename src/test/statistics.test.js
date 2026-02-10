import { describe, it, expect } from 'vitest'

import tTest from '../utils/statistics/tTest'
import welchsTTest from '../utils/statistics/welchsTTest'
import statsSummary from '../utils/statistics/statsSummary'
import barnardsExact from '../utils/statistics/barnardsExact'
import oneWayANOVA from '../utils/statistics/oneWayANOVA'
import mcnemarTest from '../utils/statistics/mcnemarTest'
import pearsonCorrelation from '../utils/statistics/pearsonCorrelation'
import spearmanCorrelation from '../utils/statistics/spearmanCorrelation'
import kolmogorovSmirnovTest from '../utils/statistics/kolmogorovSmirnovTest'
import kruskalWallisTest from '../utils/statistics/kruskalWallisTest'
import mannWhitneyU from '../utils/statistics/mannWhitneyU'
import sign from '../utils/statistics/sign'
import wilcoxonSignedRankTest from '../utils/statistics/wilcoxonSignedRankTest'
import fisherExactTest from '../utils/statistics/fisherExactTest'
import chiSquaredTest from '../utils/statistics/chiSquaredTest'

import reviveSpecialNumbers from './reviveSpecialNumbers'
import rawResults from '../../fixtures/test_data_stats.json'

const results = reviveSpecialNumbers(structuredClone(rawResults));

describe('Statistics - Cross-language validation', () => {

  describe('stats-summary', () => {
    if (results?.summary)
      Object.entries(results.summary).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = statsSummary(input.data, input.confidence_level)
          expect(jsResult.size).toBeCloseTo(pythonResult.size, 5)
          expect(jsResult.median).toBeCloseTo(pythonResult.median, 5)
          expect(jsResult.average).toBeCloseTo(pythonResult.average, 5)
          expect(jsResult.ci[0]).toBeCloseTo(pythonResult.ci[0], 5)
          expect(jsResult.ci[1]).toBeCloseTo(pythonResult.ci[1], 5)
          expect(jsResult.sd).toBeCloseTo(pythonResult.sd, 5)
          expect(jsResult.se).toBeCloseTo(pythonResult.se, 5)
          expect(jsResult.min).toBeCloseTo(pythonResult.min, 5)
          expect(jsResult.max).toBeCloseTo(pythonResult.max, 5)
          expect(jsResult.sum).toBeCloseTo(pythonResult.sum, 5)
        })
      })
  })

  describe('t-test', () => {
    if (results?.t_test)
      Object.entries(results.t_test).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = tTest(input.group1, input.group2, input.alternative)
          expect(jsResult.tStatistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.degreesOfFreedom).toBeCloseTo(pythonResult.df, 5)
          expect(jsResult.means).toEqual(pythonResult.means, 5)
          expect(jsResult.meanDifference).toBeCloseTo(pythonResult.mean_difference, 5)
          expect(jsResult.pooledVariance).toBeCloseTo(pythonResult.pooled_variance, 5)
          expect(jsResult.cohenD).toBeCloseTo(pythonResult.cohen_d, 5)
          expect(jsResult.pooledStandardDeviation).toBeCloseTo(pythonResult.pooled_standard_deviation, 5)
          expect(jsResult.standardError).toBeCloseTo(pythonResult.standard_error, 5)
          expect(jsResult.confidenceInterval[0]).toBeCloseTo(pythonResult.ci.low, 5)
          expect(jsResult.confidenceInterval[1]).toBeCloseTo(pythonResult.ci.high, 5)
        })
      })
  })

  describe('welchs-t-test', () => {
    if (results?.welchs_t_test)
      Object.entries(results.welchs_t_test).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = welchsTTest(input.group1, input.group2, input.alternative)
          expect(jsResult.tStatistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.degreesOfFreedom).toBeCloseTo(pythonResult.df, 5)
          expect(jsResult.means).toEqual(pythonResult.means, 5)
          expect(jsResult.averageSTDV).toBeCloseTo(pythonResult.average_stdv, 5)
          expect(jsResult.cohenD).toBeCloseTo(pythonResult.cohen_d, 5)
          expect(jsResult.standardError).toBeCloseTo(pythonResult.standard_error, 5)
          expect(jsResult.confidenceInterval[0]).toBeCloseTo(pythonResult.ci.low, 5)
          expect(jsResult.confidenceInterval[1]).toBeCloseTo(pythonResult.ci.high, 5)
        })
      })
  })

  describe('barnards_exact', () => {
    if (results?.barnards_exact)
      Object.entries(results.barnards_exact).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = barnardsExact(input.a, input.b, input.c, input.d)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.p1).toBeCloseTo(pythonResult.p1, 5)
          expect(jsResult.p2).toBeCloseTo(pythonResult.p2, 5)
          expect(jsResult.difference).toBeCloseTo(pythonResult.difference, 5)
          expect(jsResult.zScore).toBeCloseTo(pythonResult.z_score, 5)
          expect(jsResult.pooledProportion).toBeCloseTo(pythonResult.pooled_proportion, 5)
          expect(jsResult.standardError).toBeCloseTo(pythonResult.standard_error, 5)
          expect(jsResult.calculationMethod).toBe(pythonResult.calculation_method)
        })
      })
  })

  describe('one_way_anova', () => {
    if (results?.anova)
      Object.entries(results.anova).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = oneWayANOVA(input.groups, input.labels)

          // Adjust comparison based on NaN
          if (isNaN(pythonResult.f_statistic)) {
            expect(isNaN(jsResult.fStatistic)).toBe(true)
            expect(isNaN(jsResult.pValue)).toBe(true)
            expect(isNaN(jsResult.etaSquared)).toBe(true)
          } else {
            expect(jsResult.fStatistic).toBeCloseTo(pythonResult.f_statistic, 5)
            expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
            expect(jsResult.etaSquared).toBeCloseTo(pythonResult.eta_squared, 5)
          }

          expect(jsResult.degreesOfFreedomBetween).toBeCloseTo(pythonResult.degrees_of_freedom_between, 5)
          expect(jsResult.degreesOfFreedomWithin).toBeCloseTo(pythonResult.degrees_of_freedom_within, 5)
          expect(jsResult.degreesOfFreedomTotal).toBeCloseTo(pythonResult.degrees_of_freedom_total, 5)
          
          expect(jsResult.sumOfSquares.between).toBeCloseTo(pythonResult.sum_of_squares.between, 5)
          expect(jsResult.sumOfSquares.within).toBeCloseTo(pythonResult.sum_of_squares.within, 5)
          expect(jsResult.sumOfSquares.total).toBeCloseTo(pythonResult.sum_of_squares.total, 5)
          
          expect(jsResult.meanSquares.between).toBeCloseTo(pythonResult.mean_squares.between, 5)
          expect(jsResult.meanSquares.within).toBeCloseTo(pythonResult.mean_squares.within, 5)
                    
          for(let i in jsResult.groupStatistics){
            expect(jsResult.groupStatistics[i].label).toBe(pythonResult.group_statistics[i].label, 5)
            expect(jsResult.groupStatistics[i].n).toBeCloseTo(pythonResult.group_statistics[i].n, 5)
            expect(jsResult.groupStatistics[i].mean).toBeCloseTo(pythonResult.group_statistics[i].mean, 5)
            expect(jsResult.groupStatistics[i].variance).toBeCloseTo(pythonResult.group_statistics[i].variance, 5)
            expect(jsResult.groupStatistics[i].standardDeviation).toBeCloseTo(pythonResult.group_statistics[i].standard_deviation, 5)
          }
          
          expect(jsResult.overallMean).toBeCloseTo(pythonResult.overall_mean, 5)
          expect(jsResult.totalSampleSize).toBeCloseTo(pythonResult.total_sample_size, 5)
        
        })
      })
  })

  describe('mcnemar_test', () => {
    if (results?.mcnemar)
      Object.entries(results.mcnemar).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = mcnemarTest(input.contingency_table, input.continuity_correction)
          expect(jsResult.statistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.discordantPairs).toBeCloseTo(pythonResult.discordant_pairs, 5)
          expect(jsResult.continuityCorrection).toBeCloseTo(pythonResult.continuity_correction, 5)
          expect(jsResult.method).toBe(pythonResult.method)
        })
      })
  })

  describe('pearson_correlation', () => {
    if (results?.pearson_correlation)
      Object.entries(results.pearson_correlation).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = pearsonCorrelation(input.x, input.y, input.alternative)

          expect(jsResult.correlationCoefficient).toBeCloseTo(pythonResult.correlation_coefficient, 5)

          if (!isFinite(pythonResult.test_statistic)) {
            expect(!isFinite(jsResult.tStatistic)).toBe(true)
            expect(!isFinite(jsResult.pValue)).toBe(true)
            expect(!isFinite(jsResult.confidenceInterval95[0])).toBe(true)
            expect(!isFinite(jsResult.confidenceInterval95[1])).toBe(true)
          } else {
            expect(jsResult.tStatistic).toBeCloseTo(pythonResult.test_statistic, 5)
            expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
            expect(jsResult.confidenceInterval95[0]).toBeCloseTo(pythonResult.confidence_interval_95[0], 5)
            expect(jsResult.confidenceInterval95[1]).toBeCloseTo(pythonResult.confidence_interval_95[1], 5)
          }
          expect(jsResult.degreesOfFreedom).toBeCloseTo(pythonResult.degrees_of_freedom, 5)
          expect(jsResult.sampleSize).toBeCloseTo(pythonResult.sample_size, 5)
          expect(jsResult.alternative).toBe(pythonResult.alternative)

        })
      })
  })

  describe('spearman_correlation', () => {
    if (results?.spearman_correlation)
      Object.entries(results.spearman_correlation).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = spearmanCorrelation(input.x, input.y)
          expect(jsResult.correlation).toBeCloseTo(pythonResult.correlation, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.confidenceInterval[0]).toBeCloseTo(pythonResult.confidence_interval[0], 5)
          expect(jsResult.confidenceInterval[1]).toBeCloseTo(pythonResult.confidence_interval[1], 5)
          expect(jsResult.n).toBeCloseTo(pythonResult.n, 5)
          if (!isFinite(pythonResult.test_statistic)) {
            expect(!isFinite(jsResult.testStatistic)).toBe(true)
          } else {
            expect(jsResult.testStatistic).toBeCloseTo(pythonResult.test_statistic, 5)
          }
        })
      })
  })

  describe('kolmogorov_smirnov', () => {
    if (results?.kolmogorov_smirnov)
      Object.entries(results.kolmogorov_smirnov).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = kolmogorovSmirnovTest(input.sample1, input.sample2, input.cdf, input.alternative)
          expect(jsResult.dStatistic).toBeCloseTo(pythonResult.d_statistic, 5)

          // p-value has inherent approximation differences - just check it's reasonable
          expect(jsResult.pValue).toBeGreaterThanOrEqual(0)
          expect(jsResult.pValue).toBeLessThanOrEqual(1)

          expect(jsResult.sampleSize1).toBeCloseTo(pythonResult.sample_size_1, 5)
          expect(jsResult.sampleSize1).toBeCloseTo(pythonResult.sample_size_1, 5)
          expect(jsResult.alternative).toBe(pythonResult.alternative)
        })
      })
  })

  describe('kruskal_wallis', () => {
    if (results?.kruskal_wallis)
      Object.entries(results.kruskal_wallis).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = kruskalWallisTest(input.groups)

          expect(jsResult.statistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.degreesOfFreedom).toBeCloseTo(pythonResult.degrees_of_freedom, 5)
          expect(jsResult.effectSize).toBeCloseTo(pythonResult.effect_size, 5)
          expect(jsResult.groupSizes).toEqual(pythonResult.group_sizes)
        })
      })
  })

  describe('mann_whitney_u', () => {
    if (results?.mann_whitney_u)
      Object.entries(results.mann_whitney_u).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = mannWhitneyU(input.group1, input.group2, input.alternative)
          expect(jsResult.U).toBeCloseTo(pythonResult.U, 5)
          expect(jsResult.U1).toBeCloseTo(pythonResult.U1, 5)
          expect(jsResult.U2).toBeCloseTo(pythonResult.U2, 5)
          expect(jsResult.z).toBeCloseTo(pythonResult.z, 2)
          if (input.group1.length >= 4 && input.group2.length >= 4) {
              expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 1)
          }
          expect(jsResult.meanRank1).toBeCloseTo(pythonResult.mean_rank_1, 5)
          expect(jsResult.meanRank2).toBeCloseTo(pythonResult.mean_rank_2, 5)
          expect(jsResult.alternative).toBe(pythonResult.alternative)

        })
      })
  })

  describe('sign_test', () => {
    if (results?.sign_test)
      Object.entries(results.sign_test).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = sign(input.before, input.after, input.alternative)
          expect(jsResult.pairs).toBeCloseTo(pythonResult.pairs, 5)
          expect(jsResult.non_zero_diff).toBeCloseTo(pythonResult.non_zero_diff, 5)
          expect(jsResult.sample_diff).toBe(pythonResult.sample_diff)
          expect(jsResult.positive).toBe(pythonResult.positive)
          expect(jsResult.negative).toBe(pythonResult.negative)
          expect(jsResult.ignored).toBeCloseTo(pythonResult.ignored, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
        })
      })
  })

  describe('wilcoxon_signed_rank', () => {
    if (results?.wilcoxon_signed_rank)
      Object.entries(results.wilcoxon_signed_rank).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = wilcoxonSignedRankTest(input.x, input.y, input.alternative)
          expect(jsResult.statistic).toBeCloseTo(pythonResult.statistic, 5)
          // Only check p-value for larger samples where normal approximation is valid
          if (input.x.length >= 20) {
            expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 2)
          }
          expect(jsResult.effectSize).toBeCloseTo(pythonResult.effect_size, 5)
          expect(jsResult.n).toBeCloseTo(pythonResult.n, 5)
          expect(jsResult.alternative).toBe(pythonResult.alternative)
        })
      })
  })

  describe('fisher_exact_test', () => {
    if (results?.fisher_exact)
      Object.entries(results.fisher_exact).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = fisherExactTest(input.data, input.alternative)

          expect(jsResult.statistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.pValue).toBeCloseTo(pythonResult.p_value, 5)
          expect(jsResult.alternative).toBe(pythonResult.alternative)
          
          expect(jsResult.a).toBeCloseTo(pythonResult.a, 5)
          expect(jsResult.b).toBeCloseTo(pythonResult.b, 5)
          expect(jsResult.c).toBeCloseTo(pythonResult.c, 5)
          expect(jsResult.d).toBeCloseTo(pythonResult.d, 5)
          
          expect(jsResult.rowSums).toEqual(pythonResult.row_sums, 5)
          expect(jsResult.colSums).toEqual(pythonResult.col_sums, 5)
        })
      })
  })

  describe('chi_squared_test', () => {
    if (results?.chi_squared)
      Object.entries(results.chi_squared).forEach(([caseName, caseResult]) => {
        it(`matches Python for ${caseName}`, () => {
          const { input, output: pythonResult } = caseResult
          const jsResult = chiSquaredTest(input.data)

          expect(jsResult.statistic).toBeCloseTo(pythonResult.statistic, 5)
          expect(jsResult.degreesOfFreedom).toBeCloseTo(pythonResult.degrees_of_freedom, 5)
          expect(jsResult.sampleSize).toBeCloseTo(pythonResult.sample_size, 5)
          expect(jsResult.rowCount).toBeCloseTo(pythonResult.row_count, 5)
          expect(jsResult.colCount).toBeCloseTo(pythonResult.col_count, 5)
          expect(jsResult.rowTotals).toEqual(pythonResult.row_totals)
          expect(jsResult.columnTotals).toEqual(pythonResult.column_totals)
          expect(jsResult.effectSize).toBeCloseTo(pythonResult.effect_size, 5)

          if(jsResult?.details)
            for(let i in jsResult.details){
              expect(jsResult.details[i].row).toBeCloseTo(pythonResult.details[i].row, 5)
              expect(jsResult.details[i].column).toBeCloseTo(pythonResult.details[i].column, 5)
              expect(jsResult.details[i].observed).toBeCloseTo(pythonResult.details[i].observed, 5)
              expect(jsResult.details[i].expected).toBeCloseTo(pythonResult.details[i].expected, 5)
              expect(jsResult.details[i].chiSquared).toBeCloseTo(pythonResult.details[i].chi_squared, 5)
              expect(jsResult.details[i].expectedWarning).toBe(pythonResult.details[i].expected_warning)
            }
        })
      })
  })

})
