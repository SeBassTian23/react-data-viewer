import cellId from './cell-id'

/**
 * Build a markdown cell for a jupyter notebook
 * @param {string, object} text string of text or array of individual lines 
 * @returns object
 */
export default function markdownCell(text) {

  if(Array.isArray(text))
    text = text.join('\n')

  return {
    id: cellId(),
    cell_type: "markdown",
    metadata: {},
    source: text.split("\n").map(l => l + "\n")
  };
}