import numpy as np
from scipy import stats
import math

def wilcoxon_signed_rank_test(x, y, alternative='two-sided'):
    """
    Wilcoxon Signed-Rank Test
    Non-parametric test for paired samples
    
    Tests whether paired samples have the same distribution
    
    Args:
        x: First sample (array-like)
        y: Second sample (array-like)
        alternative: 'two-sided', 'less', 'greater' (default: 'two-sided')
    
    Returns:
        dict with test results
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    
    if len(x) != len(y):
        return {'error': 'Samples must have equal length for paired test'}
    
    # Calculate differences and remove zeros
    differences = x - y
    non_zero_diffs = differences[differences != 0]
    
    if len(non_zero_diffs) == 0:
        return {
            'statistic': 0.0,
            'p_value': 1.0,
            'effect_size': 0.0,
            'n': 0,
            'alternative': alternative
        }
    
    n = len(non_zero_diffs)
    
    # Get absolute values and ranks
    abs_diffs = np.abs(non_zero_diffs)
    # Use scipy's rankdata for ranking
    ranks = stats.rankdata(abs_diffs)
    
    # Calculate W+ (sum of ranks for positive differences)
    w_plus = np.sum(ranks[non_zero_diffs > 0])
    
    # Use scipy's wilcoxon test for accurate p-value
    result = stats.wilcoxon(x, y, alternative=alternative)
    p_value = result.pvalue
    
    # Calculate z-score for effect size
    expected_w = n * (n + 1) / 4
    variance_w = n * (n + 1) * (2 * n + 1) / 24
    z = (w_plus - expected_w) / math.sqrt(variance_w)
    
    # Effect size (r = |Z| / sqrt(N))
    effect_size = abs(z) / math.sqrt(n)
    
    return {
        'statistic': float(w_plus),
        'p_value': float(p_value),
        'effect_size': float(effect_size),
        'n': int(n),
        'alternative': alternative
    }
