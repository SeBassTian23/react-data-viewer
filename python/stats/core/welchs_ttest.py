from scipy import stats
import numpy as np
import math

# Welch's t-Test
def welchs_t_test_independent(group1, group2, alternative='two-sided', confidence_level=0.95):
    """Perform independent samples t-test"""
    result = stats.ttest_ind(group1, group2, equal_var=False, alternative=alternative)
    ci = result.confidence_interval(confidence_level)

    # Sample variance (n-1 in denominator)
    variance1 = np.var(group1, ddof=1)
    variance2 = np.var(group2, ddof=1)

    average_stdv = math.sqrt((variance1 + variance2) / 2)

    # Cohen's d (effect size)
    cohens_d = (np.mean(group1) - np.mean(group2)) / average_stdv

    return {
        'statistic': float(result.statistic),
        'p_value': float(result.pvalue),
        'df': float(result.df),
        'means': [
            np.mean(group1),
            np.mean(group2),
        ],
        'standard_error': float(result._standard_error),
        'ci': {
            'low': float(ci.low),
            'high': float(ci.high)
        },
        'cohen_d': cohens_d,
        'average_stdv': average_stdv
    }
