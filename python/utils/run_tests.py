import json
from pathlib import Path

from utils import JSCompatibleEncoder

def run_tests(fn, directory, output_file):
    
    # Get all files (including subdirectories) using rglob
    files = [f for f in directory.rglob("*") if f.is_file()]

    # Print the list of files
    results = dict()
    for file in files:
        result = fn(file)
        results.update( result )
        print(f"✓ Test for { Path(file).stem }")

    # Write to file that JS tests can read
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, separators=(', ', ': '), ensure_ascii=False, cls=JSCompatibleEncoder)

    print(f"✓ Results exported to {output_file}")