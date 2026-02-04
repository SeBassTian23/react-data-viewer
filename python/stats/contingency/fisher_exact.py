import numpy as np
from scipy import stats
import math

def fisher_exact_test(data, alternative='two-sided'):
    """
    Fisher's Exact Test
    Tests association in 2x2 contingency tables
    
    Tests the null hypothesis of independence of the observed frequencies
    in a 2x2 contingency table.
    
    Args:
        data: 2x2 contingency table as [[a, b], [c, d]] where:
              a = top-left cell
              b = top-right cell
              c = bottom-left cell
              d = bottom-right cell
        alternative: 'two-sided', 'greater', 'less' (default: 'two-sided')
    
    Returns:
        dict with test results including p-value and odds ratio
    """
    # Validate input
    if not isinstance(data, (list, np.ndarray)) or len(data) != 2:
        return {'error': 'Data must be a 2x2 contingency table'}
    
    if len(data[0]) != 2 or len(data[1]) != 2:
        return {'error': 'Data must be a 2x2 contingency table [[a,b],[c,d]]'}
    
    # Extract contingency table values
    a = int(data[0][0])
    b = int(data[0][1])
    c = int(data[1][0])
    d = int(data[1][1])
    
    # Check for non-negative integers
    if a < 0 or b < 0 or c < 0 or d < 0:
        return {'error': 'All contingency table values must be non-negative'}
    
    n = a + b + c + d
    row_sum1 = a + b
    row_sum2 = c + d
    col_sum1 = a + c
    col_sum2 = b + d
    
    # Use scipy's fisher_exact for accurate p-value calculation
    # Note: scipy's fisher_exact uses the hypergeometric distribution
    odds_ratio, p_value = stats.fisher_exact([[a, b], [c, d]], alternative=alternative)
    
    # Handle infinite odds ratio (when b=0 or c=0)
    if math.isinf(odds_ratio):
        odds_ratio = None
    
    # Calculate probability of observed table using hypergeometric distribution
    # P(X = a) where X ~ Hypergeometric(N, K, n)
    obs_prob = stats.hypergeom.pmf(a, n, col_sum1, row_sum1)
    
    return {
        'statistic': float(obs_prob),
        'p_value': float(p_value),
        'odds_ratio': float(odds_ratio) if odds_ratio is not None else None,
        'alternative': alternative,
        'n': int(n),
        'a': int(a),
        'b': int(b),
        'c': int(c),
        'd': int(d),
        'row_sums': [int(row_sum1), int(row_sum2)],
        'col_sums': [int(col_sum1), int(col_sum2)]
    }
