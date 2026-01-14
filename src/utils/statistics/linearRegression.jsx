
import jStat from 'jstat'

/**
 * Linear regression analysis
 * @param {Array} x - Independent variable (predictor)
 * @param {Array} y - Dependent variable (response)
 * @returns {Object} Regression results
 */
export default function linearRegression(x, y) {
    if (x.length !== y.length) {
        return {error: 'Groups must have equal length'};
    }
    
    const n = x.length;
    const meanX = jStat.mean(x);
    const meanY = jStat.mean(y);
    
    // Calculate slope and intercept
    const numerator = jStat.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY)));
    const denominator = jStat.sum(x.map(xi => Math.pow(xi - meanX, 2)));
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Predictions and residuals
    const predictions = x.map(xi => intercept + slope * xi);
    const residuals = y.map((yi, i) => yi - predictions[i]);
    
    // Sum of squares
    const sst = jStat.sum(y.map(yi => Math.pow(yi - meanY, 2))); // Total sum of squares
    const sse = jStat.sum(residuals.map(r => r * r)); // Error sum of squares
    const ssr = sst - sse; // Regression sum of squares
    
    // R-squared
    const rSquared = ssr / sst;
    const adjRSquared = 1 - ((1 - rSquared) * (n - 1)) / (n - 2);
    
    // Standard errors
    const mse = sse / (n - 2);
    const slopeSE = Math.sqrt(mse / denominator);
    const interceptSE = Math.sqrt(mse * (1/n + Math.pow(meanX, 2) / denominator));
    
    // t-statistics and p-values
    const slopeTStat = slope / slopeSE;
    const interceptTStat = intercept / interceptSE;
    const df = n - 2;
    
    const slopePValue = 2 * (1 - jStat.studentt.cdf(Math.abs(slopeTStat), df));
    const interceptPValue = 2 * (1 - jStat.studentt.cdf(Math.abs(interceptTStat), df));
    
    // F-statistic for overall model
    const fStat = (ssr / 1) / (sse / df);
    const fPValue = 1 - jStat.centralF.cdf(fStat, 1, df);
    
    // Confidence intervals (95%)
    const tCritical = jStat.studentt.inv(0.975, df);
    const slopeCI = [slope - tCritical * slopeSE, slope + tCritical * slopeSE];
    const interceptCI = [intercept - tCritical * interceptSE, intercept + tCritical * interceptSE];
    
    return {
        testType: 'Linear regression',
        coefficients: {
            intercept: {
                estimate: intercept,
                standardError: interceptSE,
                tStatistic: interceptTStat,
                pValue: interceptPValue,
                confidenceInterval95: interceptCI
            },
            slope: {
                estimate: slope,
                standardError: slopeSE,
                tStatistic: slopeTStat,
                pValue: slopePValue,
                confidenceInterval95: slopeCI
            }
        },
        modelFit: {
            rSquared: rSquared,
            adjustedRSquared: adjRSquared,
            fStatistic: fStat,
            fPValue: fPValue,
            residualStandardError: Math.sqrt(mse),
            degreesOfFreedom: df
        },
        residuals: residuals,
        predictions: predictions,
        sampleSize: n
    };
}
