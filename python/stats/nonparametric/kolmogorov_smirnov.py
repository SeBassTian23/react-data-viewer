import numpy as np
from scipy import stats
import math

def kolmogorov_smirnov_test(sample1, sample2=None, cdf=None, alternative='two-sided'):
    """
    Kolmogorov-Smirnov test
    
    Tests whether sample(s) come from a specific distribution or whether
    two samples come from the same distribution.
    
    Args:
        sample1: First sample (array-like)
        sample2: Second sample for two-sample test (optional)
        cdf: Theoretical CDF function for one-sample test (optional)
        alternative: 'two-sided', 'greater', 'less' (default: 'two-sided')
    
    Returns:
        dict with test results
    """
    sample1 = np.asarray(sample1, dtype=float)
    
    if sample2 is None and cdf is None:
        raise ValueError('For one-sample test, provide a CDF function')
    
    if sample2 is None:
        # One-sample KS test
        n = len(sample1)
        sorted_sample = np.sort(sample1)
        
        d_plus = 0  # max(F_n(x) - F_0(x))
        d_minus = 0  # max(F_0(x) - F_n(x))
        
        for i in range(n):
            empirical_cdf = (i + 1) / n
            theoretical_cdf = cdf(sorted_sample[i])
            empirical_cdf_prev = i / n
            
            d_plus = max(d_plus, empirical_cdf - theoretical_cdf)
            d_minus = max(d_minus, theoretical_cdf - empirical_cdf_prev)
        
        # Select test statistic based on alternative hypothesis
        if alternative == 'two-sided':
            d_stat = max(d_plus, d_minus)
        elif alternative == 'greater':
            d_stat = d_plus
        else:  # 'less'
            d_stat = d_minus
        
        # P-value using Kolmogorov distribution
        # scipy.stats.ksone provides the exact distribution
        p_value = stats.ksone.sf(d_stat, n)
        
        return {
            'test_type': 'One-sample Kolmogorov-Smirnov test',
            'd_statistic': float(d_stat),
            'p_value': float(p_value),
            'sample_size': int(n),
            'alternative': alternative
        }
    else:
        # Two-sample KS test
        sample2 = np.asarray(sample2, dtype=float)
        n1 = len(sample1)
        n2 = len(sample2)
        
        sorted_sample1 = np.sort(sample1)
        sorted_sample2 = np.sort(sample2)
        
        # Combine and get unique values
        combined = np.unique(np.concatenate([sorted_sample1, sorted_sample2]))
        
        d_plus = 0
        d_minus = 0
        
        for value in combined:
            cdf1 = np.sum(sorted_sample1 <= value) / n1
            cdf2 = np.sum(sorted_sample2 <= value) / n2
            
            d_plus = max(d_plus, cdf1 - cdf2)
            d_minus = max(d_minus, cdf2 - cdf1)
        
        # Select test statistic based on alternative hypothesis
        if alternative == 'two-sided':
            d_stat = max(d_plus, d_minus)
        elif alternative == 'greater':
            d_stat = d_plus
        else:  # 'less'
            d_stat = d_minus
        
        # P-value using Kolmogorov distribution for two-sample test
        # scipy.stats.ks_2samp provides the exact distribution
        p_value = stats.ks_2samp(sample1, sample2, alternative=alternative).pvalue
        
        return {
            'test_type': 'Two-sample Kolmogorov-Smirnov test',
            'd_statistic': float(d_stat),
            'p_value': float(p_value),
            'sample_size_1': int(n1),
            'sample_size_2': int(n2),
            'alternative': alternative
        }