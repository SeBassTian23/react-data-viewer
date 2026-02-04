import numpy as np
from scipy import stats
import math

def mcnemar_test(contingency_table, continuity_correction=True):
    """
    McNemar's Test
    Test for paired categorical data (2x2 contingency table)
    
    Contingency table format:
        [[a, b],
         [c, d]]
    
    Where:
    - a: both positive
    - b: first positive, second negative (discordant)
    - c: first negative, second positive (discordant)
    - d: both negative
    
    Args:
        contingency_table: 2x2 array [[a,b],[c,d]]
        continuity_correction: Apply continuity correction (default: True)
    
    Returns:
        dict with test results
    """
    if len(contingency_table) != 2 or len(contingency_table[0]) != 2 or len(contingency_table[1]) != 2:
        raise ValueError('Contingency table must be 2x2')
    
    a = contingency_table[0][0]
    b = contingency_table[0][1]
    c = contingency_table[1][0]
    d = contingency_table[1][1]
    
    # Check that all values are non-negative integers
    if a < 0 or b < 0 or c < 0 or d < 0:
        raise ValueError('All cell counts must be non-negative')
    
    # McNemar's test focuses on discordant pairs
    discordant = b + c
    
    if discordant == 0:
        return {
            'statistic': 0.0,
            'p_value': 1.0,
            'method': 'McNemar Test',
            'discordant_pairs': int(discordant),
            'continuity_correction': continuity_correction
        }
    
    # For small samples (discordant < 25), use exact binomial test
    if discordant < 25:
        # Two-tailed exact binomial test
        min_discordant = min(b, c)
        p_exact = 2 * min(
            stats.binom.cdf(min_discordant, discordant, 0.5),
            1 - stats.binom.cdf(min_discordant - 1, discordant, 0.5)
        )
        
        return {
            'statistic': float(min_discordant),
            'p_value': float(min(1.0, p_exact)),
            'method': 'McNemar Exact Test',
            'discordant_pairs': int(discordant),
            'continuity_correction': False
        }
    
    # For larger samples, use chi-squared approximation
    if continuity_correction:
        chi_squared = (abs(b - c) - 1) ** 2 / (b + c)
        method = 'McNemar Test (with continuity correction)'
    else:
        chi_squared = (b - c) ** 2 / (b + c)
        method = 'McNemar Test (without continuity correction)'
    
    # P-value from chi-squared distribution with 1 df
    p_value = 1 - stats.chi2.cdf(chi_squared, df=1)
    
    # Odds ratio for effect size
    odds_ratio = b / c if (b > 0 and c > 0) else None
    
    return {
        'statistic': float(chi_squared),
        'p_value': float(p_value),
        'method': method,
        'discordant_pairs': int(discordant),
        'continuity_correction': continuity_correction,
        'odds_ratio': float(odds_ratio) if odds_ratio is not None else None
    }