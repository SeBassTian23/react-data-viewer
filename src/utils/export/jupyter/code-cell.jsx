import cellId from './cell-id'

/**
 * Build a code cell for a jupyter notebook
 * @param {string, object} code string of code or array of individual lines 
 * @returns 
 */
export default function codeCell(code) {

  if(Array.isArray(code))
    code = code.join('\n')

  return {
    id: cellId(),
    cell_type: "code",
    metadata: {},
    source: code.split("\n").map(l => l + "\n"),
    outputs: [],
    execution_count: null
  };
}
