/**
 * Define Lookup Table for Parameter Thresholds
 */
export default function tresholdsCell(thresholds){

  let lookupThresholds = []
  thresholds.filter(el => el.alias).forEach(el => {
    let tval = []
    if(el.min)
      tval.push(`"min" = ${Number(el.min)}`)
    if(el.max)
      tval.push(`"max" = ${Number(el.max)}`)
    let t = `"${el.name}" = list(\n${tval.join(',\n')})`
  })

  return `LOOKUP_THRESHOLDS <- list(${lookupThresholds.join(',\n')})`;
}