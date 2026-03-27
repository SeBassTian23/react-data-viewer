/**
 * Define Lookup Table for Parameter Aliases
 */
export default function aliasCell(parameters){

  let lookupAlias = []
  parameters.filter(el => el.alias).forEach(el => {
    lookupAlias.push(`"${el.name}" = "${el.alias}"`)
  })

  return `LOOKUP_ALIAS <- list(${lookupAlias.join(',\n')})`;
}