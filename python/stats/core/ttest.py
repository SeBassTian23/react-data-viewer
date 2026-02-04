from scipy import stats
import numpy as np
import math

# Student's t-Test
def t_test_independent(group1, group2, alternative='two-sided', confidence_level=0.95):
    """Perform independent samples t-test"""
    result = stats.ttest_ind(group1, group2, alternative=alternative)
    ci = result.confidence_interval(confidence_level)

    # Sample variance (n-1 in denominator)
    variance1 = np.var(group1, ddof=1)
    variance2 = np.var(group2, ddof=1)
    
    # Calculate pooled standard deviation for Cohen's d
    pooled_variance = ((len(group1) - 1) * variance1 + (len(group2) - 1) * variance2) / result.df
    pooled_std_dev = math.sqrt(pooled_variance)
    
    # Cohen's d (effect size)
    cohens_d = (np.mean(group1) - np.mean(group2)) / pooled_std_dev

    return {
        'statistic': float(result.statistic),
        'p_value': float(result.pvalue),
        'df': float(result.df),
        'means': [
            np.mean(group1),
            np.mean(group2),
        ],
        'mean_difference': np.mean(group1) - np.mean(group2),
        'standard_error': float(result._standard_error),
        'ci': {
            'low': float(ci.low),
            'high': float(ci.high)
        },
        'pooled_variance': pooled_variance,
        'cohen_d': cohens_d,
        'pooled_standard_deviation': pooled_std_dev
    }
