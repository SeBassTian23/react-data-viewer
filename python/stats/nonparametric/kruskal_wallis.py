import numpy as np
from scipy import stats

def kruskal_wallis_test(groups):
    """
    Kruskal-Wallis Test
    Non-parametric test for comparing multiple groups
    
    Tests whether k independent groups have the same distribution
    
    Args:
        groups: List of arrays, each containing data for one group
    
    Returns:
        dict with test results
    """
    if len(groups) < 2:
        return {'error': 'Need at least 2 groups for Kruskal-Wallis test'}
    
    # Combine all data and track group membership
    all_data = []
    group_sizes = []
    
    for i, group in enumerate(groups):
        group_array = np.asarray(group, dtype=float)
        if len(group_array) == 0:
            return {'error': f'Group {i} is empty'}
        group_sizes.append(len(group_array))
        for value in group_array:
            all_data.append({'value': value, 'group': i})
    
    N = len(all_data)
    
    # Sort combined data and assign ranks
    all_data.sort(key=lambda x: x['value'])
    ranks = [0] * N
    
    # Handle ties by assigning average ranks
    i = 0
    while i < N:
        j = i
        while j < N and all_data[j]['value'] == all_data[i]['value']:
            j += 1
        avg_rank = (i + j + 1) / 2
        for k in range(i, j):
            ranks[k] = avg_rank
        i = j
    
    # Calculate rank sums for each group
    rank_sums = [0] * len(groups)
    for i in range(N):
        rank_sums[all_data[i]['group']] += ranks[i]
    
    # Calculate H statistic
    H = 0
    for i, group_size in enumerate(group_sizes):
        R_i = rank_sums[i]
        H += (R_i * R_i) / group_size
    
    H = (12 / (N * (N + 1))) * H - 3 * (N + 1)
    
    # Degrees of freedom
    df = len(groups) - 1
    
    # P-value using chi-squared distribution
    p_value = 1 - stats.chi2.cdf(H, df)
    
    # Effect size (eta-squared approximation)
    eta_squared = (H - df) / (N - 1)
    
    return {
        'statistic': float(H),
        'p_value': float(p_value),
        'degrees_of_freedom': int(df),
        'effect_size': float(max(0, eta_squared)),
        'group_sizes': [int(n) for n in group_sizes]
    }
