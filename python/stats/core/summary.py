from scipy import stats
import numpy as np

# Statistical Summary
def stats_summary(data, confidence_level=0.95):
    """Perform statistical summary"""

    stdev = np.std(data, ddof=1)
    se = stats.sem(data)

    if stdev == 0 or se == 0:
        ci = [np.mean(data), np.mean(data)]
    else:
        if len(data) < 30:
            ci = stats.t.interval(
                confidence=confidence_level,
                df=len(data) - 1,
                loc=np.mean(data),
                scale=stats.sem(data)
            )
        else:
            ci = stats.norm.interval(
                confidence=confidence_level,
                loc=np.mean(data),
                scale=stats.sem(data)
            )

    return {
        'size': len(data),
        'median': np.median(data),
        'average': np.mean(data),
        'ci': ci,
        'sd': stdev,
        'se': se,
        'min': np.min(data),
        'max': np.max(data),
        'sum': np.sum(data)
    }