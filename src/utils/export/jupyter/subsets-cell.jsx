import codeCell from './code-cell'

/**
 * Define and apply subsets for dataframe
 */
export default function subsetsCell(subsets=[]){
  
  const code = []

  if(subsets.length == 0)
    subsets.push({id: 'all', name: 'Whole Dataset', color: 'blue', isVisible: true })
  
  code.push(`## Subsets Lookup Table\n`)
  code.push(`LOOKUP_SUBSETS = {`)
  subsets.forEach( (el) => {
    code.push(`  "${el.id}": {`)
    code.push(`    "name": "${el.name}",`)
    code.push(`    "color": "${el.color}",`)
    code.push(`    "isVisible": ${el.isVisible? "True" : "False" },`)
    code.push(`  },`)
  })
  code.push(`}`)
  
  return codeCell(code)
}