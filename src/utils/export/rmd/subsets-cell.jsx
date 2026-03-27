/**
 * Define Lookup Table for Parameter Aliases
 */
export default function subsetsCell(subsets=[]){

  let s =[]

  if(subsets.length == 0)
    subsets.push({id: 'all', name: 'Whole Dataset', color: 'blue', isVisible: true })
  
  subsets.forEach( (el) => {
    s.push(`"${el.id}" = list(
"name" = "${el.name}",
"color" = "${el.color}",
"isVisible" = ${el.isVisible? "TRUE" : "FALSE"}
)`)
  })

  return `LOOKUP_SUBSETS <- list(${s.join(',\n')})`;
}