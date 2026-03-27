import codeCell from './code-cell'

/**
 * Define and apply thresholds for dataframe
 */
export default function thresholdsCell(thresholds){

  const lookupThreshold = {}
  thresholds.forEach(el => { 
    lookupThreshold[el.name] = {}
    if(el.min)
      lookupThreshold[el.name]['min'] = Number(el.min)
    if(el.max)
      lookupThreshold[el.name]['max'] = Number(el.max)
  })
  
  const code = `## Thresholds Lookup Table\nLOOKUP_THRESHOLDS = ${JSON.stringify(lookupThreshold, null, 2)}\n`
  return codeCell(code)
}