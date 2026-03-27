/**
 * Functions for notebook
 */
export default function functionsCell() {

  return`## Load required packages

#' Apply Subset Filter to Dataframe
#'
#' @param df Dataframe to filter
#' @param subsets Named list of subset definitions
#' @return Filtered dataframe
apply_subsets <- function(df, subsets) {
  keys <- names(subsets)[map_lgl(subsets, ~ .x$isVisible)]
  df %>% filter(__subsets__ %in% keys)
}

#' Apply Threshold Filter to Dataframe
#'
#' @param df Dataframe to filter
#' @param thresholds Named list of threshold rules
#' @return Filtered dataframe
apply_thresholds <- function(df, thresholds) {
  mask <- rep(TRUE, nrow(df))

  for (col in names(thresholds)) {
    if (!(col %in% names(df))) next

    rules <- thresholds[[col]]
    if (!is.null(rules$min)) mask <- mask & (df[[col]] >= rules$min)
    if (!is.null(rules$max)) mask <- mask & (df[[col]] <= rules$max)
  }

  df[mask, ]
}

#' Get Data Subset Info
#'
#' @param subsets Named list of subset definitions
#' @return List with name_map, color_map, and category_order
get_subset_info <- function(subsets) {
  visible <- subsets[map_lgl(subsets, ~ .x$isVisible)]
  color_map <- map_chr(visible, ~ .x$color)
  name_map <- map_chr(visible, ~ .x$name)
  category_order <- names(visible)

  list(name_map = name_map, color_map = color_map, category_order = category_order)
}

#' Map Zoom Level
#'
#' @param bounds List of c(min_lat, min_lon), c(max_lat, max_lon)
#' @return Integer zoom level (0-24)
get_zoom_level <- function(bounds) {
  min_lat <- bounds[[1]][1]
  min_lon <- bounds[[1]][2]
  max_lat <- bounds[[2]][1]
  max_lon <- bounds[[2]][2]

  lat_span <- max_lat - min_lat
  lon_span <- max_lon - min_lon
  max_span <- max(lat_span, lon_span)

  if (max_span == 0) return(18L)

  zoom <- log2(360 / max_span)
  zoom <- max(0, min(24, zoom))

  as.integer(zoom)
}

#' Expand Dataframe by Subsets
#'
#' @param df Dataframe to expand
#' @param subsets_column Name of column containing subsets
#' @return Expanded dataframe
expand_df_by_subsets <- function(df, subsets_column = "__subsets__") {
  df %>%
    mutate(!!subsets_column := map(!!sym(subsets_column), ~ if (is.list(.x)) .x else list(.x))) %>%
    unnest(cols = !!sym(subsets_column))
}

#' Sort Dataframe by Subsets
#'
#' @param df Dataframe to sort
#' @param subset_order Named list of subset definitions
#' @param subsets_column Name of column containing subsets
#' @return Sorted dataframe
sort_df_by_subsets <- function(df, subset_order, subsets_column = "__subsets__") {
  visible_subset_order <- names(subset_order)[sapply(subset_order, function(x) x$isVisible)]
  df <- df %>%
    mutate(!!subsets_column := factor(!!sym(subsets_column), levels = visible_subset_order, ordered = TRUE)) %>%
    arrange(!!sym(subsets_column))
  return(df)
}`
}