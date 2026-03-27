import codeCell from './code-cell'
/**
 * Functions for notebook
 */
export default function functionsCell() {

return codeCell(`## Apply Subset Filter to Dataframe
def apply_subsets(df, subsets):
  keys = [k for k, v in subsets.items() if v["isVisible"]]
  return df[df["__subsets__"].astype(str).isin(keys)]

## Apply Threshold Filter to Dataframe
def apply_thresholds(df, thresholds):
  mask = pd.Series(True, index=df.index)

  for col, rules in thresholds.items():
      if col not in df.columns:
          continue

      if "min" in rules:
          mask &= df[col] >= rules["min"]

      if "max" in rules:
          mask &= df[col] <= rules["max"]

  return df[mask]

## Get Data Subset Info
def get_subset_info(subsets):
  visible = {k: v for k, v in subsets.items() if v["isVisible"]}

  color_map = {k: v["color"] for k, v in visible.items()}
  name_map = {k: v["name"] for k, v in visible.items()}
  category_order = list(visible.keys())

  return name_map, color_map, category_order

def expand_df_by_subsets(df, subsets_column='__subsets__'):
    """Convert sets/lists to individual rows, one per subset."""
    df_copy = df.copy()
    
    # Convert sets to lists for explode
    df_copy[subsets_column] = df_copy[subsets_column].apply(
        lambda x: list(x) if isinstance(x, set) else x
    )
    
    # Explode creates a row for each element in the list
    return df_copy.explode(subsets_column).reset_index(drop=True)

def sort_df_by_subsets(df, subset_order={}):
    # Filter lookup to only visible subsets
    visible_subset_order = [
        id for id, data in subset_order.items() 
        if data['isVisible']
    ]

    # Convert __subsets__ to categorical with only visible categories
    df['__subsets__'] = pd.Categorical(
        df['__subsets__'],
        categories=visible_subset_order,
        ordered=True
    )

    # Sort by the categorical column
    return df.sort_values('__subsets__').reset_index(drop=True)
`)
}