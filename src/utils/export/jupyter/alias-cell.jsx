import codeCell from './code-cell'

/**
 * Define and apply thresholds for dataframe
 */
export default function aliasCell(parameters){

  const lookupAlias = {}
  parameters.filter(el => el.alias).forEach(el => { lookupAlias[el.name] = el.alias })

  const code = `## Alias Lookup Table\nLOOKUP_ALIAS = ${JSON.stringify(lookupAlias, null, 2)}`

  return codeCell( code );
}