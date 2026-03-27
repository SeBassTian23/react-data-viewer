/**
 * Generate a map view
 * @param {object} content 
 */
export default function mapCell(content) {

  let code = `bounds <- list(
  c(${content.bounds[0][0]}, ${content.bounds[0][1]}),
  c(${content.bounds[1][0]}, ${content.bounds[0][1]})
)

df_with_colors <- data
df_with_colors$color <- sapply(df_with_colors$id, function(id) LOOKUP_SUBSETS[[id]]$color)
`
  
  if(content.colorType != "series")
    code += `
pal <- leaflet::colorNumeric(
  palette = "${content.colorScale}",
  domain = df_with_colors$\`${content.colorBy}\`
)
`
  code += `leaflet(df_with_colors) %>%
  addTiles() %>%
  fitBounds(
    lng1 = bounds[[1]][2], lat1 = bounds[[1]][1],
    lng2 = bounds[[2]][2], lat2 = bounds[[2]][1]
  ) %>%
  addCircleMarkers(
    lng = ~longitude,
    lat = ~latitude,
    color = 'black',
    fillColor = ${content.colorType == "series"? `~color` : `~pal(\`${content.colorBy}\`)` },
    radius = 4,
    stroke = TRUE,
    weight = 1,
    fillOpacity = ${content.colorType == "series"? 1 : 0.8 }
  )`

  return code;
}