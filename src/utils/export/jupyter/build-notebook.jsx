import codeCell from './code-cell'
import markdownCell from './markdown-cell'
import thresholdsCell from './thresholds-cell'
import subsetsCell from './subsets-cell'
import functionsCell from './functions-cell'
import aliasCell from './alias-cell'

/**
 * Build a Notebook from the analysis data and the dashboard widgets
 * @param {object} analysis analysis informations
 * @param {object} dashboard array with definitions for panels
 * @param {object} thresholds array with threshold definitions
 * @param {object} parameters array with all parameter definitions
 * @param {object} subsets array with data subsets
 * @return jupyter notebook object
 */
export default function buildNotebook ( analysis={}, dashboard=[], thresholds=[], parameters=[], subsets=[] ) {

  // Basic jupyter Notebook
  let nb = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        name: "python"
      }
    },
    cells: []
  };

  let installCell = [
    `# Install dependencies if needed`,
    `# pip install -r requirements.txt`
  ]

  // Analysis information
  let analysisCell = [
    `# ${analysis.name}`,
    analysis.notes,
    `Started: ${new Date(analysis.created_at).toLocaleTimeString()} | Last Update: ${new Date(analysis.updated_at).toLocaleTimeString()}`
  ]

  // Array with dependencies
  let dependenciesCell  = [
    'from pathlib import Path',
    'import json',
    'import pandas as pd',
    'import numpy as np'
  ]

  // Start adding cells to notebook

  // Analysis Cell
  nb.cells.push( markdownCell(analysisCell) );
  
  // Install Cell
  nb.cells.push( codeCell(installCell) )

  // Dependencies Cell
  nb.cells.push( codeCell("## Load Dependencies\n" + dependenciesCell.join('\n')) );

  // Section title
  nb.cells.push( markdownCell(`## Functions\n\nThese functions simplify the interaction between Lookup tables and dataframe.`) )
  
  // Functions
  nb.cells.push( functionsCell() )

  // Section title
  nb.cells.push( markdownCell(`## Data Import\n\nImport data into the dataframe.`) )

  // Data Import Cell
  const dataCell = [
    `## Data Import`,
    `DATA_PATH = Path("data/dataset.json")`,
    `text = DATA_PATH.read_text()`,
    `data = json.loads(text)`,
    `df = pd.DataFrame(data)`,
    `## Now expand the dataframe so it is easy to select data by the __subsets__ column`,
    `df = expand_df_by_subsets(df, subsets_column='__subsets__')`,
    `df.info(verbose=True)`,
  ]
  nb.cells.push( codeCell(dataCell) );

  // Section title
  nb.cells.push( markdownCell(`## Lookup Tables\n\nThese tables contain extra information about the dataframe content.`) )

  // Lookup Table Alias
  nb.cells.push( aliasCell( parameters ) );

  // Lookup Table Thresholds
  nb.cells.push( thresholdsCell(thresholds) );

  // Lookup Table Subsets
  nb.cells.push( subsetsCell(subsets) )

  // Section title
  nb.cells.push( markdownCell(`## Filter Dataframe\n\nApply filters to dataframe`) )

  // Filter dataframe
  nb.cells.push( codeCell(`## Apply Thresholds from Lookup Table to dataframe
df = apply_thresholds(df, LOOKUP_THRESHOLDS)
    
## Apply subsets from Lookup Table to dataframe
df = apply_subsets(df, LOOKUP_SUBSETS)

## Print information about subsets
print('## Selected Data Subsets')
print('--')
counts = df.groupby("__subsets__").size()
for idx, value in counts.to_dict().items():
  print( "%s (color: %s): %s" %(LOOKUP_SUBSETS[idx]['name'], LOOKUP_SUBSETS[idx]['color'], value) )
print("Total: %s" % counts.sum())
`) )
  
  return nb;
}
