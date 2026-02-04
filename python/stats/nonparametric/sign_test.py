import numpy as np
from scipy import stats

def sign_test(before, after, alternative='two-sided'):
    """
    Sign test
    Non-parametric test for paired samples
    
    Tests whether there is a consistent difference between paired observations
    
    Args:
        before: First sample (array-like)
        after: Second sample (array-like)
        alternative: 'two-sided', 'greater', 'less' (default: 'two-sided')
    
    Returns:
        dict with test results
    """
    before = np.asarray(before, dtype=float)
    after = np.asarray(after, dtype=float)
    
    if len(before) != len(after) or len(before) == 0:
        return {'error': 'Before and after groups must have equal length and contain at least one value.'}
    
    # Calculate differences
    differences = after - before
    non_zero_diffs = differences[differences != 0]
    n = len(non_zero_diffs)
    
    if n == 0:
        return {'error': 'All differences are zero. Cannot perform sign test.'}
    
    # Count positive and negative differences
    positive = np.sum(non_zero_diffs > 0)
    negative = np.sum(non_zero_diffs < 0)
    
    # Sign test uses binomial distribution with p = 0.5
    # scipy.stats.binom_test or binomtest provides exact p-value
    if alternative == 'two-sided':
        smaller = min(positive, negative)
        # Two-tailed: p-value = 2 * P(X <= smaller)
        p_value = 2 * stats.binom.cdf(smaller, n, 0.5)
        p_value = min(p_value, 1.0)
    elif alternative == 'greater':
        # One-tailed greater: P(X >= positive)
        p_value = 1 - stats.binom.cdf(positive - 1, n, 0.5)
        p_value = min(p_value, 1.0)
    else:  # 'less'
        # One-tailed less: P(X <= positive)
        p_value = stats.binom.cdf(positive, n, 0.5)
        p_value = min(p_value, 1.0)
    
    # Create sample differences string (first 10 values)
    sample_diffs_str = ', '.join([f'{d:.2f}' for d in differences[:10]])
    if len(differences) > 10:
        sample_diffs_str += '...'
    
    return {
        'pairs': int(len(before)),
        'non_zero_diff': int(n),
        'sample_diff': sample_diffs_str,
        'positive': int(positive),
        'negative': int(negative),
        'ignored': int(len(before) - n),
        'p_value': float(p_value)
    }
