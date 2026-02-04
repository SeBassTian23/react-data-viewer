import sys
from pathlib import Path

import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from stats import (
    welchs_t_test_independent,
    barnards_exact,
    t_test_independent,
    stats_summary,
    one_way_anova,
    mcnemar_test,
    pearson_correlation,
    spearman_correlation,
    kolmogorov_smirnov_test,
    kruskal_wallis_test,
    mann_whitney_u,
    sign_test,
    wilcoxon_signed_rank_test,
    fisher_exact_test,
    chi_squared_test
)

from utils import JSCompatibleEncoder

def test_and_export_results(input_file):
    """Run tests and export results for JS comparison"""
    if Path(input_file).is_file():
        with open(input_file, 'r') as f:
            test_data = json.load(f)
    
    results = {}

    ## Process Summary Tests
    if 'summary' in test_data:
        results['summary'] = {}
        for case_name, case_data in test_data['summary'].items():
            results['summary'][case_name] = {
                'input': case_data,
                'output': stats_summary(
                    case_data['data'],
                    case_data.get('confidence_level', 0.95)
                )
            }

    ## Process Student's t-tests
    if 't_test' in test_data:
        results['t_test'] = {}
        for case_name, case_data in test_data['t_test'].items():
            results['t_test'][case_name] = {
                'input': case_data,
                'output': t_test_independent(
                    case_data['group1'],
                    case_data['group2'],
                    case_data.get('alternative', 'two-sided'),
                    case_data.get('confidence_level', 0.95)
                )
            }

    ## Process Welch's t-tests
    if 'welchs_t_test' in test_data:
        results['welchs_t_test'] = {}
        for case_name, case_data in test_data['welchs_t_test'].items():
            results['welchs_t_test'][case_name] = {
                'input': case_data,
                'output': welchs_t_test_independent(
                    case_data['group1'],
                    case_data['group2'],
                    case_data.get('alternative', 'two-sided'),
                    case_data.get('confidence_level', 0.95)
                )
            }

    ## Bernard's exact Tests
    if 'barnards_exact' in test_data:
        results['barnards_exact'] = {}
        for case_name, case_data in test_data['barnards_exact'].items():
            results['barnards_exact'][case_name] = {
                'input': case_data,
                'output': barnards_exact(
                    case_data['a'],
                    case_data['b'],
                    case_data['c'],
                    case_data['d'],
                    case_data.get('fast_mode' , False)
                )
            }

    ## One Way Anova Tests
    if 'anova' in test_data:
        results['anova'] = {}
        for case_name, case_data in test_data['anova'].items():
            results['anova'][case_name] = {
                'input': case_data,
                'output': one_way_anova(
                    case_data['groups'],
                    case_data.get('labels' , None)
                )
            } 
    
    ## McNemar's Tests
    if 'mcnemar' in test_data:
        results['mcnemar'] = {}
        for case_name, case_data in test_data['mcnemar'].items():
            results['mcnemar'][case_name] = {
                'input': case_data,
                'output': mcnemar_test(
                    case_data['contingency_table'],
                    case_data.get('continuity_correction' , True)
                )
            } 

    ## Pearson Correlation Tests
    if 'pearson_correlation' in test_data:
        results['pearson_correlation'] = {}
        for case_name, case_data in test_data['pearson_correlation'].items():
            results['pearson_correlation'][case_name] = {
                'input': case_data,
                'output': pearson_correlation(
                    case_data['x'],
                    case_data['y'],
                    case_data.get('alternative' , 'two-sided')
                )
            } 

    ## Spearman Correlation Tests
    if 'spearman_correlation' in test_data:
        results['spearman_correlation'] = {}
        for case_name, case_data in test_data['spearman_correlation'].items():
            results['spearman_correlation'][case_name] = {
                'input': case_data,
                'output': spearman_correlation(
                    case_data['x'],
                    case_data['y']
                )
            } 

    ## Kolmogorov Smirnov Tests
    if 'kolmogorov_smirnov' in test_data:
        results['kolmogorov_smirnov'] = {}
        for case_name, case_data in test_data['kolmogorov_smirnov'].items():
            results['kolmogorov_smirnov'][case_name] = {
                'input': case_data,
                'output': kolmogorov_smirnov_test(
                    case_data['sample1'],
                    case_data['sample2'],
                    case_data.get('cdf', None),
                    case_data.get('alternative', 'two-sided')
                )
            } 

    ## Kruskal Wallis Tests
    if 'kruskal_wallis' in test_data:
        results['kruskal_wallis'] = {}
        for case_name, case_data in test_data['kruskal_wallis'].items():
            results['kruskal_wallis'][case_name] = {
                'input': case_data,
                'output': kruskal_wallis_test(
                    case_data['groups']
                )
            } 

    ## Mann Whitney U Tests
    if 'mann_whitney_u' in test_data:
        results['mann_whitney_u'] = {}
        for case_name, case_data in test_data['mann_whitney_u'].items():
            results['mann_whitney_u'][case_name] = {
                'input': case_data,
                'output': mann_whitney_u(
                    case_data['group1'],
                    case_data['group2'],
                    case_data.get('alternative', 'two-sided')
                )
            } 

    ## Sign Tests
    if 'sign_test' in test_data:
        results['sign_test'] = {}
        for case_name, case_data in test_data['sign_test'].items():
            results['sign_test'][case_name] = {
                'input': case_data,
                'output': sign_test(
                    case_data['before'],
                    case_data['after'],
                    case_data.get('alternative', 'two-sided')
                )
            } 

    ## Wolcoxon Signed Rank Tests
    if 'wilcoxon_signed_rank' in test_data:
        results['wilcoxon_signed_rank'] = {}
        for case_name, case_data in test_data['wilcoxon_signed_rank'].items():
            results['wilcoxon_signed_rank'][case_name] = {
                'input': case_data,
                'output': wilcoxon_signed_rank_test(
                    case_data['x'],
                    case_data['y'],
                    case_data.get('alternative', 'two-sided')
                )
            } 

    ## Fisher's exact Tests
    if 'fisher_exact' in test_data:
        results['fisher_exact'] = {}
        for case_name, case_data in test_data['fisher_exact'].items():
            results['fisher_exact'][case_name] = {
                'input': case_data,
                'output': fisher_exact_test(
                    case_data['data'],
                    case_data.get('alternative', 'two-sided')
                )
            } 

    ## Chi Squared Tests
    if 'chi_squared' in test_data:
        results['chi_squared'] = {}
        for case_name, case_data in test_data['chi_squared'].items():
            results['chi_squared'][case_name] = {
                'input': case_data,
                'output': chi_squared_test(
                    case_data['data']
                )
            } 


    return results
    
if __name__ == '__main__':
    # Specify the directory path
    directory = Path("./fixtures/test_data_stats")

    # Get all files (including subdirectories) using rglob
    files = [f for f in directory.rglob("*") if f.is_file()]

    # Print the list of files
    results = dict()
    for file in files:
        result = test_and_export_results(file)
        results.update( result )
        print(f"✓ Test for { Path(file).stem }")

    # Write to file that JS tests can read
    output_file = './fixtures/test_data_stats.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, separators=(', ', ': '), ensure_ascii=False, cls=JSCompatibleEncoder)

    print(f"✓ Results exported to {output_file}")