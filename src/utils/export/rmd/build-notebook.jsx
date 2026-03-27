import aliasCell from "./alias-cell";
import thresholdsCell from "./thresholds-cell";
import subsetsCell from "./subsets-cell";
import functionsCell from "./functions-cell";

/**
 * Build a Notebook from the analysis data and the dashboard widgets
 * @param {object} analysis analysis informations
 * @param {object} dashboard array with definitions for panels
 * @param {object} thresholds array with threshold definitions
 * @param {object} parameters array with all parameter definitions
 * @param {object} subsets array with data subsets
 * @return jupyter notebook object
 */
export default function buildNotebook(analysis = {}, dashboard = [], thresholds = [], parameters = [], subsets = []) {

  let dependencies = [
    "dplyr",
    "tidyr",
    "jsonlite",
    "purrr",
    "ggplot2"
  ]
  
  let media = []

  let rmd = `---
title: "${analysis.name}"
description: "${analysis.notes}"
author: "React Data Viewer${analysis?.creator?.name ? ` (${analysis.creator.name})` : ""}"
date: "${analysis.updated_at}"
output: html_notebook
params:
  dataset: "dataset/data.json"
---
`
  rmd += `## Load Dependencies
\`\`\`{r setup}
packages <- readLines("packages.txt")
missing <- setdiff(packages, rownames(installed.packages()))

if (length(missing)) {
  install.packages(missing, repos = "https://cloud.r-project.org")
}

lapply(packages, library, character.only = TRUE)
\`\`\`

## Functions

These functions simplify the interaction between Lookup tables and dataframe.

\`\`\`{r}
${functionsCell()}
\`\`\`

## Data Import

Import data into the dataframe.

\`\`\`{r}
## Load data from JSON file
data <- jsonlite::fromJSON("data/dataset.json")
# data <- jsonlite::fromJSON("params$dataset")

## Expand Dataframe
## Now expand the dataframe so it is easy to select data
## by the __subsets__ column
data <- expand_df_by_subsets(data, subsets_column='__subsets__')

head(data)
\`\`\`

## Lookup Tables

These tables contain extra information about the dataframe content.

### Alias Lookup Table
\`\`\`{r}
${aliasCell(parameters)}
\`\`\`

### Thresholds Lookup Table
\`\`\`{r}
${thresholdsCell(thresholds)}
\`\`\`

### Subsets Lookup Table
\`\`\`{r}
${subsetsCell(subsets)}
\`\`\`

## Filter Dataframe

Apply filters to dataframe
\`\`\`{r}
## Apply Thresholds from Lookup Table to dataframe
data <- apply_thresholds(data, LOOKUP_THRESHOLDS)

## Apply subsets from Lookup Table to dataframe
data <- apply_subsets(data, LOOKUP_THRESHOLDS)

## Print information about subsets
counts <- data %>%
group_by(\`__subsets__\`) %>%
summarise(n = n(), .groups = "drop")

# Iterate over unique subset IDs
unique_subsets <- unique(counts$\`__subsets__\`)
walk(unique_subsets, ~ {
idx <- .x
value <- counts$n[counts$\`__subsets__\` == idx]
cat(
sprintf("%s (color: %s): %s\n",
LOOKUP_SUBSETS[[idx]]$name,
LOOKUP_SUBSETS[[idx]]$color,
value)
)
})
cat(sprintf("Total: %s\n", sum(counts$n)))
\`\`\`
`;

  return rmd;
}
