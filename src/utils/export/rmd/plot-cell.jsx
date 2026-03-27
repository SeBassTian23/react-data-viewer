/**
 * Generate a plot view
 * @param {object} content 
 */
export default function plotCell(content) {

  let code = `${JSON.stringify(content, null, 2)}`

  return code;
}