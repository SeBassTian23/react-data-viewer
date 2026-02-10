import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import warnings

warnings.filterwarnings('ignore')

# ================================
# 1. Standardize features (z-score)
# ================================
def standardize(data):
    """
    Standardize features using z-score normalization.
    
    Args:
        data: array-like data matrix
    
    Returns:
        Standardized data as numpy array
    """
    data = np.asarray(data)
    means = np.mean(data, axis=0)
    stds = np.std(data, axis=0, ddof=1)  # ddof=1 for sample std like jStat
    stds[stds == 0] = 1  # Avoid division by zero
    
    return (data - means) / stds

# ================================
# 5. Run k-means multiple times
# ================================
def run_kmeans_multiple(data, k, runs=30, max_iterations=200, initialization='k-means++'):
    """
    Run k-means clustering multiple times and return best result.
    
    Args:
        data: input data
        k: number of clusters
        runs: number of times to run k-means
        max_iterations: maximum iterations per run
        initialization: initialization method ('k-means++' or 'random')
    
    Returns:
        Dictionary with best clustering results
    """
    data = np.asarray(data)
    best_error = np.inf
    best_result = None
    
    for i in range(runs):
        kmeans = KMeans(
            n_clusters=k,
            init=initialization,
            max_iter=max_iterations,
            n_init=1,
            random_state=i,
            tol=1e-4
        )
        kmeans.fit(data)
        
        error = kmeans.inertia_ #compute_wcss(data, kmeans.cluster_centers_, kmeans.labels_)
        
        if error < best_error:
            best_error = error
            best_result = {
                'clusters': kmeans.labels_,
                'centroids': kmeans.cluster_centers_,
                'error': error,
                'n_iter': kmeans.n_iter_
            }
    
    return best_result


# ================================
# 6. Determine best K (Main function)
# ================================
def determine_best_k(raw_data, k_min=2, k_max=10, runs_per_k=30, min_silhouette=0.25, 
                     max_iterations=100, initialization='k-means++'):
    """
    Determine the optimal number of clusters using silhouette score and WCSS.
    
    Mirrors the JavaScript determineBestK function behavior exactly.
    
    Args:
        raw_data: input data
        k_min: minimum number of clusters to test
        k_max: maximum number of clusters to test
        runs_per_k: number of k-means runs per k value
        min_silhouette: minimum acceptable silhouette score
        max_iterations: maximum iterations for k-means
        initialization: initialization method ('k-means++' or 'random')
    
    Returns:
        Dictionary with best result and all results
    """
    data = standardize(raw_data)
    results = []
    
    print("\n" + "="*80)
    print("K-MEANS CLUSTERING RESULTS")
    print("="*80 + "\n")
    print(f"{'K':<5} {'Error':<15} {'Silhouette (Custom)':<20} {'Silhouette (SKLearn)':<20} {'Singletons':<15}")
    print("-"*100)
    
    for k in range(int(k_min), int(k_max) + 1):
        best_run = run_kmeans_multiple(
            data, k,
            runs=int(runs_per_k),
            max_iterations=int(max_iterations),
            initialization=initialization
        )
        
        try:
            sil_score = silhouette_score(data, best_run['clusters'])
        except ValueError:
            sil_score = np.nan  # Return NaN when sklearn can't compute
        
        # Count singleton clusters
        unique_labels, counts = np.unique(best_run['clusters'], return_counts=True)
        singleton_count = np.sum(counts == 1)
        
        result = {
            'k': k,
            'error': best_run['error'],
            'silhouette': sil_score,
            'silhouette_sklearn': sil_score,
            'clusters': best_run['clusters'],
            'centroids': best_run['centroids'],
            'n_iter': best_run['n_iter']
        }
        results.append(result)
        
        sklearn_str = f"{sil_score:.4f}" if not np.isnan(sil_score) else "N/A"
        print(f"{k:<5} {best_run['error']:<15.4f} {sil_score:<20.4f} {sklearn_str:<20} {int(singleton_count):<15}")
    
    print("-"*80 + "\n")
    
    # Filter by silhouette threshold (using custom implementation)
    viable = []
    for r in results:
        # Filter by minimum silhouette (using custom implementation)
        if r['silhouette'] < min_silhouette:
            continue
        
        # Reject if any cluster has only 1 point (singleton cluster)
        unique_labels, counts = np.unique(r['clusters'], return_counts=True)
        if np.any(counts == 1):
            continue
        
        viable.append(r)
    
    if len(viable) == 0:
        return {
            'best': None,
            'allResults': results,
            'reason': 'No K met minimum silhouette threshold or all results contained singleton clusters'
        }
    
    # Improved sorting: prioritize silhouette (descending), then error (ascending), then k (ascending)
    viable.sort(key=lambda x: (
        -x['silhouette'],  # Higher silhouette is better
        x['error'],        # Lower error is better
        x['k']             # Smaller k is better (simplicity)
    ))
    
    return {
        'best': viable[0],
        'allResults': results
    }
