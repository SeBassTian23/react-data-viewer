import numpy as np
from scipy import stats
import math

def mann_whitney_u(group1, group2, alternative='two-sided'):
    """
    Mann-Whitney U test
    Non-parametric test for comparing two independent samples
    
    Tests whether two independent samples come from the same distribution
    
    Args:
        group1: First sample (array-like)
        group2: Second sample (array-like)
        alternative: 'two-sided', 'greater', 'less' (default: 'two-sided')
    
    Returns:
        dict with test results
    """
    group1 = np.asarray(group1, dtype=float)
    group2 = np.asarray(group2, dtype=float)
    
    n1 = len(group1)
    n2 = len(group2)
    
    # Combine and rank all values
    combined = np.concatenate([group1, group2])
    sorted_indices = np.argsort(combined)
    sorted_combined = combined[sorted_indices]
    
    # Assign ranks (handling ties)
    ranks = np.empty_like(sorted_combined)
    i = 0
    while i < len(sorted_combined):
        j = i
        # Find end of tied group
        while j < len(sorted_combined) - 1 and sorted_combined[j] == sorted_combined[j + 1]:
            j += 1
        # Assign average rank to tied values
        avg_rank = (i + j + 2) / 2  # +2 because ranks start at 1
        for k in range(i, j + 1):
            ranks[k] = avg_rank
        i = j + 1
    
    # Map ranks back to original groups
    ranks_by_group = np.empty(len(combined))
    ranks_by_group[sorted_indices] = ranks
    
    # Calculate rank sums
    R1 = np.sum(ranks_by_group[:n1])
    R2 = np.sum(ranks_by_group[n1:])
    
    # Calculate U statistics
    U1 = R1 - (n1 * (n1 + 1)) / 2
    U2 = R2 - (n2 * (n2 + 1)) / 2
    U = min(U1, U2)
    
    # Use scipy's built-in function for more accurate p-value
    result = stats.mannwhitneyu(group1, group2, alternative=alternative)
    
    # Calculate z-score for reference
    mean_u = (n1 * n2) / 2
    std_u = math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12)
    z = (U1 - mean_u) / std_u if std_u > 0 else 0
    
    return {
        'test_type': 'Mann-Whitney U Test',
        'U': float(U),
        'U1': float(U1),
        'U2': float(U2),
        'z': float(z),
        'p_value': float(result.pvalue),
        'mean_rank_1': float(R1 / n1),
        'mean_rank_2': float(R2 / n2),
        'alternative': alternative
    }
