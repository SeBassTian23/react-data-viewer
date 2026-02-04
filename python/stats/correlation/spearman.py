import numpy as np
from scipy import stats
import math
from scipy.stats import rankdata

def spearman_correlation(x, y):
    """
    Spearman Rank Correlation
    Non-parametric correlation coefficient
    
    Tests the null hypothesis of no rank correlation between x and y
    
    Args:
        x: First variable (array-like)
        y: Second variable (array-like)
    
    Returns:
        dict with Spearman correlation test results
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    
    if x.shape[0] != y.shape[0]:
        return {'error': 'Variables must have equal length'}
    
    n = x.shape[0]
    
    if n < 3:
        return {'error': 'Need at least 3 data points for correlation'}
    
    # Convert to ranks (scipy's rankdata handles ties automatically)
    x_ranks = rankdata(x)
    y_ranks = rankdata(y)
    
    # Calculate Pearson correlation on ranks
    rho = np.corrcoef(x_ranks, y_ranks)[0, 1]
    
    # Handle edge cases (perfect correlation)
    if abs(rho) >= 1.0 or math.isnan(rho):
        return {
            'correlation': float(rho),
            'p_value': 0.0,
            'confidence_interval': [float(rho), float(rho)],
            'n': int(n),
            'test_statistic': float('inf') if rho > 0 else float('-inf')
        }
    
    # Test statistic for significance
    t = rho * math.sqrt((n - 2) / (1 - rho * rho))
    
    # P-value (two-tailed test)
    p_value = 2 * (1 - stats.t.cdf(abs(t), n - 2))
    
    # 95% Confidence interval using Fisher's Z transformation
    z = 0.5 * math.log((1 + rho) / (1 - rho))
    z_se = 1 / math.sqrt(n - 3)
    z_lower = z - 1.96 * z_se
    z_upper = z + 1.96 * z_se
    
    ci_lower = (math.exp(2 * z_lower) - 1) / (math.exp(2 * z_lower) + 1)
    ci_upper = (math.exp(2 * z_upper) - 1) / (math.exp(2 * z_upper) + 1)
    
    return {
        'correlation': float(rho),
        'p_value': float(p_value),
        'confidence_interval': [float(ci_lower), float(ci_upper)],
        'n': int(n),
        'test_statistic': float(t)
    }