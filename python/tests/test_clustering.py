import sys
from pathlib import Path

import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from clustering import (
    determine_best_k,
)

from utils import run_tests

def test_and_export_results(input_file):
    """Run tests and export results for JS comparison"""
    print(input_file)
    if Path(input_file).is_file():
        with open(input_file, 'r') as f:
            test_data = json.load(f)
    
    results = {}

    ## Process Summary Tests
    if 'kmeans' in test_data:
        results['kmeans'] = {}
        for case_name, case_data in test_data['kmeans'].items():
            results['kmeans'][case_name] = {
                'input': case_data,
                'output': determine_best_k(
                    case_data['data'],
                    case_data.get('k_min', 2),
                    case_data.get('k_max', 10),
                    case_data.get('runs_per_k', 30),
                    case_data.get('min_silhouette', 0.25),
                    case_data.get('max_iterations', 100),
                    case_data.get('initialization', 'k-means++')
                )
            }

    return results
 
def main():
    # Specify the directory path for test data
    directory = Path("./fixtures/test_data_cluster")

    # Specify test results output file name
    output_file = './fixtures/test_data_cluster.json'

    # Run available tests
    run_tests(test_and_export_results, directory, output_file)

if __name__ == '__main__':
    main()