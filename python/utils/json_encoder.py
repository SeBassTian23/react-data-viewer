import json
import math
import numpy as np

class JSCompatibleEncoder(json.JSONEncoder):
    def iterencode(self, obj, _one_shot=False):
        def replace(o):
            if isinstance(o, (float, np.float32, np.float64)):
                if math.isnan(o) or np.isnan(o):
                    return "NaN"
                if math.isinf(o):
                    return "Infinity" if o > 0 else "-Infinity"
                return float(o)
            if isinstance(o, dict):
                return {k: replace(v) for k, v in o.items()}
            if isinstance(o, (list, tuple)):
                return [replace(v) for v in o]
            if isinstance(o, (np.int32, np.int64)):
                return int(o)
            if isinstance(o, dict):
                return {k: replace(v) for k, v in o.items()}
            if isinstance(o, list):
                return [replace(v) for v in o]
            if isinstance(o, (np.bool)):
                return bool(o)
            return o

        # IMPORTANT: call parent iterencode on the transformed object
        return super().iterencode(replace(obj), _one_shot)
