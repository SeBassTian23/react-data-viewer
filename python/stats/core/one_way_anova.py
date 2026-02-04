import numpy as np
from scipy import stats
import math

def one_way_anova(groups, labels=None):
    """
    One-way ANOVA
    
    Args:
        groups: List of arrays, each containing data for one group
        labels: Group labels (optional)
    
    Returns:
        dict with ANOVA results
    """
    if not isinstance(groups, list) or len(groups) < 2:
        return {'error': 'Need at least 2 groups'}
    
    k = len(groups)  # number of groups
    group_sizes = [len(g) for g in groups]
    n = sum(group_sizes)  # total sample size
    
    if labels is None:
        labels = [f'Group {i + 1}' for i in range(k)]
    
    # Group means and overall mean
    group_means = [np.mean(g) for g in groups]
    all_data = np.concatenate(groups)
    overall_mean = np.mean(all_data)
    
    # Sum of squares between groups (SSB)
    ssb = sum([group_sizes[i] * (group_means[i] - overall_mean)**2 for i in range(k)])
    
    # Sum of squares within groups (SSW)
    ssw = sum([sum([(x - group_means[i])**2 for x in groups[i]]) for i in range(k)])
    
    # Total sum of squares
    sst = ssb + ssw
    
    # Degrees of freedom
    df_between = k - 1
    df_within = n - k
    df_total = n - 1
    
    # Mean squares
    msb = ssb / df_between
    msw = ssw / df_within
    
    # F-statistic and p-value
    f_stat = msb / msw
    p_value = 1 - stats.f.cdf(f_stat, df_between, df_within)
    
    # Effect size (eta-squared)
    eta_squared = ssb / sst
    
    # Group statistics
    group_stats = []
    for i in range(k):
        group_data = groups[i]
        group_stats.append({
            'label': labels[i],
            'n': len(group_data),
            'mean': float(group_means[i]),
            'variance': float(np.var(group_data, ddof=1)),  # Sample variance
            'standard_deviation': float(np.std(group_data, ddof=1))  # Sample std
        })
    
    return {
        'test_type': 'One-way ANOVA',
        'f_statistic': float(f_stat),
        'p_value': float(p_value),
        'degrees_of_freedom_between': int(df_between),
        'degrees_of_freedom_within': int(df_within),
        'degrees_of_freedom_total': int(df_total),
        'sum_of_squares': {
            'between': float(ssb),
            'within': float(ssw),
            'total': float(sst)
        },
        'mean_squares': {
            'between': float(msb),
            'within': float(msw)
        },
        'eta_squared': float(eta_squared),
        'group_statistics': group_stats,
        'overall_mean': float(overall_mean),
        'total_sample_size': int(n)
    }


if __name__ == '__main__':
    # Test cases
    print("Test 1: Simple case with 3 groups")
    groups1 = [
        [1, 2, 3, 4, 5],
        [4, 5, 6, 7, 8],
        [7, 8, 9, 10, 11]
    ]
    result1 = one_way_anova(groups1, labels=['Control', 'Treatment A', 'Treatment B'])
    print(f"F-statistic: {result1['f_statistic']}")
    print(f"P-value: {result1['p_value']}\n")
    
    print("Test 2: No difference between groups")
    groups2 = [
        [5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5]
    ]
    result2 = one_way_anova(groups2)
    print(f"F-statistic: {result2['f_statistic']}")
    print(f"P-value: {result2['p_value']}\n")
    
    print("Test 3: Large difference between groups")
    groups3 = [
        [1, 2, 3],
        [10, 11, 12],
        [20, 21, 22]
    ]
    result3 = one_way_anova(groups3)
    print(f"F-statistic: {result3['f_statistic']}")
    print(f"P-value: {result3['p_value']}")