import numpy as np
from scipy import stats
import math

def pearson_correlation(x, y, alternative='two-sided'):
    """
    Pearson correlation coefficient test
    
    Tests the null hypothesis of no correlation between x and y
    
    Args:
        x: First variable (array-like)
        y: Second variable (array-like)
        alternative: 'two-sided', 'greater', 'less' (default: 'two-sided')
    
    Returns:
        dict with correlation test results
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    
    if x.shape[0] != y.shape[0]:
        return {'error': 'Variables must have equal length'}
    
    n = x.shape[0]
    
    # Calculate Pearson correlation coefficient
    r = np.corrcoef(x, y)[0, 1]
    
    # Handle edge cases
    if abs(r) >= 1.0 or math.isnan(r):
        return {
            'correlation_coefficient': float(r),
            'test_statistic': float('inf') if r > 0 else float('-inf'),
            'p_value': 0.0,
            'degrees_of_freedom': int(n - 2),
            'sample_size': int(n),
            'confidence_interval_95': [float(r), float(r)],
            'alternative': alternative
        }
    
    # Test statistic: t = r * sqrt((n-2)/(1-r^2))
    t_stat = r * math.sqrt((n - 2) / (1 - r * r))
    df = n - 2
    
    # Calculate p-value based on alternative hypothesis
    if alternative == 'two-sided':
        p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df))
    elif alternative == 'greater':
        p_value = 1 - stats.t.cdf(t_stat, df)
    else:  # 'less'
        p_value = stats.t.cdf(t_stat, df)
    
    # Fisher's z-transformation for confidence interval
    # z_r = 0.5 * ln((1+r)/(1-r))
    z_r = 0.5 * math.log((1 + r) / (1 - r))
    se_z = 1 / math.sqrt(n - 3)
    z_critical = stats.norm.ppf(0.975)
    
    z_lower = z_r - z_critical * se_z
    z_upper = z_r + z_critical * se_z
    
    # Transform back from z to r
    # r = (exp(2*z) - 1) / (exp(2*z) + 1)
    ci_lower = (math.exp(2 * z_lower) - 1) / (math.exp(2 * z_lower) + 1)
    ci_upper = (math.exp(2 * z_upper) - 1) / (math.exp(2 * z_upper) + 1)
    
    return {
        'test_type': 'Pearson correlation',
        'correlation_coefficient': float(r),
        'test_statistic': float(t_stat),
        'p_value': float(p_value),
        'degrees_of_freedom': int(df),
        'sample_size': int(n),
        'confidence_interval_95': [float(ci_lower), float(ci_upper)],
        'alternative': alternative
    }
