from scipy import stats
from scipy.special import comb
import numpy as np
import math

# Bernard's Exact Test
def barnards_exact(a, b, c, d, fast_mode=False):
    """
    Barnard's Exact Test
    
    Tests independence in a 2x2 contingency table:
        Success  Failure
    G1    a        b
    G2    c        d
    
    Args:
        a: Successes in group 1
        b: Failures in group 1
        c: Successes in group 2
        d: Failures in group 2
        fast_mode: Use approximations for speed (default: False)
    
    Returns:
        dict with test results
    """
    n1 = a + b  # Total in group 1
    n2 = c + d  # Total in group 2
    x1 = a      # Successes in group 1
    x2 = c      # Successes in group 2
    
    if n1 == 0 or n2 == 0:
        raise ValueError('Both groups must have at least one observation')

    p1 = x1 / n1  # Sample proportion 1
    p2 = x2 / n2  # Sample proportion 2
    
    # Test statistic (difference in proportions)
    test_stat = abs(p1 - p2)
    
    # Choose optimization level based on sample size
    total_n = n1 + n2
    steps = 100
    use_approximation = False
    use_chi_square_approx = False
    method_used = 'Exact'
    
    if total_n > 200:
        steps = 10
        use_approximation = True
        use_chi_square_approx = True
        method_used = f'Chi-square approximation (n={total_n})'
    elif fast_mode or total_n > 100:
        steps = min(30, max(15, total_n // 10))
        use_approximation = True
        method_used = 'Fast Mode (user selected)' if fast_mode else f'Auto-optimized (n={total_n}, normal approximation)'
    elif total_n > 50:
        steps = min(50, max(20, total_n // 5))
        use_approximation = total_n > 80
        method_used = f'Optimized (n={total_n}, with approximation)' if use_approximation else f'Optimized (n={total_n}, reduced steps)'
    
    # Barnard's test
    min_p_value = 1.0
    pooled_p = (x1 + x2) / (n1 + n2)
    
    if use_chi_square_approx:
        # Chi-square approximation for very large datasets
        expected_a = (n1 * (x1 + x2)) / (n1 + n2)
        expected_b = (n1 * (b + d)) / (n1 + n2)
        expected_c = (n2 * (x1 + x2)) / (n1 + n2)
        expected_d = (n2 * (b + d)) / (n1 + n2)
        
        chi_square = ((a - expected_a)**2 / expected_a +
                     (b - expected_b)**2 / expected_b +
                     (c - expected_c)**2 / expected_c +
                     (d - expected_d)**2 / expected_d)
        
        min_p_value = 1 - stats.chi2.cdf(chi_square, df=1)
    else:
        # Standard Barnard's test
        search_ranges = [
            {'start': max(0.01, pooled_p - 0.2), 
             'end': min(0.99, pooled_p + 0.2), 
             'steps': int(steps * 0.8)},
            {'start': 0.01, 
             'end': 0.99, 
             'steps': int(steps * 0.2)}
        ]
        
        for range_dict in search_ranges:
            step_size = (range_dict['end'] - range_dict['start']) / range_dict['steps']
            
            for i in range(range_dict['steps'] + 1):
                p = range_dict['start'] + i * step_size
                
                if p <= 0 or p >= 1:
                    continue
                
                if use_approximation and (n1 > 20 and n2 > 20):
                    p_value = calculate_p_value_approx(n1, n2, x1, x2, p, test_stat)
                else:
                    p_value = calculate_p_value_exact(n1, n2, x1, x2, p, test_stat)
                
                min_p_value = min(min_p_value, p_value)
                
                # Early termination
                if min_p_value < 1e-10:
                    break
            
            if min_p_value < 1e-10:
                break
    
    # Additional statistics
    pooled_prop = (x1 + x2) / (n1 + n2)
    se = math.sqrt(pooled_prop * (1 - pooled_prop) * (1/n1 + 1/n2))
    z = (p1 - p2) / se if se != 0 else 0
    
    return {
        'p_value': float(min_p_value),
        'test_statistic': float(test_stat),
        'p1': float(p1),
        'p2': float(p2),
        'difference': float(p1 - p2),
        'z_score': float(z),
        'pooled_proportion': float(pooled_prop),
        'standard_error': float(se),
        'calculation_method': method_used
    }

def calculate_p_value_approx(n1, n2, x1, x2, p, test_stat):
    """Normal approximation for large samples"""
    variance = p * (1 - p) * (1/n1 + 1/n2)
    sd = math.sqrt(variance)
    
    if sd == 0:
        return 0.0
    
    z = test_stat / sd
    return 2 * (1 - stats.norm.cdf(z))


def calculate_p_value_exact(n1, n2, x1, x2, p, test_stat):
    """Calculate exact p-value for Barnard's test"""
    p_value = 0.0
    
    for k1 in range(n1 + 1):
        prob1 = stats.binom.pmf(k1, n1, p)
        
        for k2 in range(n2 + 1):
            prop1 = k1 / n1
            prop2 = k2 / n2
            current_stat = abs(prop1 - prop2)
            
            # If current statistic is at least as extreme
            if current_stat >= test_stat - 1e-10:
                prob2 = stats.binom.pmf(k2, n2, p)
                p_value += prob1 * prob2
    
    return p_value