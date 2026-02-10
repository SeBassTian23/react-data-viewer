import { kmeans } from 'ml-kmeans';
import cloneDeep from 'lodash/cloneDeep'

import euclidean from './euclidean';
import standardize from './standardize';

// ================================
// 3. Total k-means error (WCSS)
// ================================
function computeTotalError(data, ans) {
  const clusterInfo = ans.computeInformation(data);

  if (!Array.isArray(clusterInfo) || clusterInfo.length === 0) {
    return Infinity;
  }

  let total = 0;

  for (const info of clusterInfo) {
    if (typeof info.error !== 'number' || !Number.isFinite(info.error)) {
      return Infinity;
    }
    total += info.error;
  }

  return {error: total, clusterInfo: cloneDeep(clusterInfo), model: cloneDeep(ans) };
}


// ================================
// 4. Silhouette score (O(n²))
// ================================
function silhouetteScore(data, clusters) {
  const n = data.length;
  const uniqueLabels = [...new Set(clusters)];
  
  if (uniqueLabels.length === 1) return 0;
  
  let total = 0;

  for (let i = 0; i < n; i++) {
    // a(i): mean distance to other points in same cluster
    const sameCluster = [];
    for (let j = 0; j < n; j++) {
      if (i !== j && clusters[i] === clusters[j]) {
        sameCluster.push(euclidean(data[i], data[j]));
      }
    }
    const a = sameCluster.length > 0 
      ? sameCluster.reduce((sum, d) => sum + d, 0) / sameCluster.length 
      : 0;

    // b(i): minimum mean distance to points in other clusters
    let b = Infinity;
    for (const otherLabel of uniqueLabels) {
      if (otherLabel === clusters[i]) continue;
      
      const otherCluster = [];
      for (let j = 0; j < n; j++) {
        if (clusters[j] === otherLabel) {
          otherCluster.push(euclidean(data[i], data[j]));
        }
      }
      
      if (otherCluster.length > 0) {
        const meanDist = otherCluster.reduce((sum, d) => sum + d, 0) / otherCluster.length;
        b = Math.min(b, meanDist);
      }
    }

    // Silhouette for this point
    const s = b === Infinity ? 0 : (b - a) / Math.max(a, b);
    total += s;
  }

  return total / n;
}

// ================================
// 5. Run k-means multiple times
// ================================
function runKMeansMultiple(data, k, runs = 30, maxIterations = 200, initialization = 'kmeans++') {
  let best = null;
  let bestError = Infinity;

  for (let i = 0; i < runs; i++) {
    const ans = kmeans(data, k, {
      initialization,
      maxIterations,
      tolerance: 1e-4
    });

    let {error, clusterInfo, model} = computeTotalError(
      data,
      ans
    );

    if (error < bestError) {
      bestError = error;
      best = {
        clusters: model.clusters,
        centroids: clusterInfo,
        error: error
      };
    }
  }

  return best;
}

// ================================
// 6. Determine best K
// ================================
export default function determineBestK(rawData, {
  kMin = 2,
  kMax = 10,
  runsPerK = 30,
  minSilhouette = 0.25,
  maxIterations = 100,
  initialization = 'kmeans++'
} = {}) {

  const data = standardize(rawData);
  const results = [];

  for (let k = parseInt(kMin); k <= parseInt(kMax); k++) {
    const bestRun = runKMeansMultiple(data, k, parseInt(runsPerK), parseInt(maxIterations), initialization);
    const silhouette = silhouetteScore(
      data,
      bestRun.clusters
    );

    results.push({
      k,
      error: bestRun.error,
      silhouette,
      clusters: bestRun.clusters,
      centroids: bestRun.centroids
    });

    // console.log(
    //   `k=${k}  error=${bestRun.error.toFixed(4)}  silhouette=${silhouette.toFixed(4)}`
    // );
  }

  const viable = results.filter(r => {
    // Filter by minimum silhouette
    if (r.silhouette < minSilhouette) {
      return false;
    }
    
    // Reject if any cluster has only 1 point (singleton cluster)
    const clusterSizes = {};
    r.clusters.forEach(label => {
      clusterSizes[label] = (clusterSizes[label] || 0) + 1;
    });
    
    return Object.values(clusterSizes).every(size => size > 1);
  });

  if (viable.length === 0) {
    return {
      best: null,
      allResults: results,
      reason: 'No K met minimum silhouette threshold or all results contained singleton clusters'
    };
  }

  // Improved sorting: prioritize silhouette (descending), then WCSS (ascending), then k (ascending)
  viable.sort((a, b) => {
    // First priority: highest silhouette
    if (Math.abs(b.silhouette - a.silhouette) > 1e-6) {
      return b.silhouette - a.silhouette;
    }
    // Second priority: lowest error (WCSS)
    if (Math.abs(b.error - a.error) > 1e-6) {
      return a.error - b.error;
    }
    // Third priority: smallest k (simplicity)
    return a.k - b.k;
  });

  return {
    best: viable[0],
    allResults: results
  };
}
