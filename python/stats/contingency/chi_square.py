import numpy as np
from scipy import stats
import math

def chi_squared_test(contingency_table):
    """
    Chi-Squared Test of Independence
    Tests association between two categorical variables
    
    Tests the null hypothesis that categorical variables are independent
    
    Args:
        contingency_table: 2D array (list of lists) where rows are categories
                          and columns are classes
                          Example: [[5, 3, 2], [2, 4, 4]]
    
    Returns:
        dict with chi-squared statistic, p-value, and effect size
    """
    # Validate input
    contingency_table = np.asarray(contingency_table, dtype=float)
    
    if contingency_table.ndim != 2 or contingency_table.shape[0] < 2:
        return {'error': 'Contingency table must be 2D with at least 2 rows'}
    
    if np.any(contingency_table < 0):
        return {'error': 'All contingency table values must be non-negative'}
    
    row_count, col_count = contingency_table.shape
    
    # Calculate row and column totals
    row_totals = np.sum(contingency_table, axis=1)
    column_totals = np.sum(contingency_table, axis=0)
    n = np.sum(row_totals)
    
    # Calculate expected frequencies
    expected = np.outer(row_totals, column_totals) / n
    
    # Calculate chi-squared statistic
    # χ² = Σ [(Observed - Expected)² / Expected]
    chi_squared = np.sum(np.power(contingency_table - expected, 2) / expected)
    
    # Degrees of freedom
    df = (row_count - 1) * (col_count - 1)
    
    # Calculate p-value
    p_value = 1 - stats.chi2.cdf(chi_squared, df)
    
    # Calculate Cramér's V (effect size)
    # V = sqrt(χ² / (n * (min(r,c) - 1)))
    cramers_v = math.sqrt(chi_squared / (n * (min(row_count, col_count) - 1)))
    
    # Build details for each cell
    details = []
    for i in range(row_count):
        for j in range(col_count):
            details.append({
                'row': int(i),
                'column': int(j),
                'observed': int(contingency_table[i][j]),
                'expected': float(expected[i][j]),
                'chi_squared': float(np.power(contingency_table[i][j] - expected[i][j], 2) / expected[i][j]),
                'expected_warning': expected[i][j] < 5
            })
    
    return {
        'statistic': float(chi_squared),
        'p_value': float(p_value),
        'degrees_of_freedom': int(df),
        'sample_size': int(n),
        'row_count': int(row_count),
        'col_count': int(col_count),
        'row_totals': [int(x) for x in row_totals],
        'column_totals': [int(x) for x in column_totals],
        'effect_size': float(cramers_v),
        'details': details
    }


def build_contingency_table(data, columns):
    """
    Helper function: Format raw data into contingency table
    Converts object with frequency counts into a contingency table
    
    Args:
        data: Dict where keys are row names and values are dicts with category counts
              Example: {'group1': {'a': 5, 'b': 3, 'c': 2}, 'group2': {'a': 2, 'b': 4, 'c': 4}}
        columns: List of column names
    
    Returns:
        2D numpy array representing the contingency table
    """
    contingency_table = []
    
    for row_key in data:
        row = [data[row_key].get(col, 0) for col in columns]
        contingency_table.append(row)
    
    return np.array(contingency_table)


def count_frequencies(values, categories):
    """
    Helper function: Count occurrences from raw data
    Converts array of values into frequency counts
    
    Args:
        values: List/array of categorical values
        categories: List of possible categories
    
    Returns:
        Dict with counts for each category
    """
    counts = {cat: 0 for cat in categories}
    
    for value in values:
        if value in counts:
            counts[value] += 1
    
    return counts
