# Data Plotting

Several different types of plots are available to visualize the data-set. Select the type of plot from the top menu and adjust the options. When changing thresholds, add/remove or edit subsets or the visibilty of a subset, the plot is automatically adjusted.

The marker/line color cannot be set in the plot menu, instead the color is set in the subset list in the sidebar. The `axis labels` are automatically given by the selected parameter names. In case the label needs to be changed, adjust the parameter name by giving the parameter an alias name. Independent of the type of plot, a `title` and `legend` can be added. When adding the plot to the dashboard, the title is used as the panel header, the legend is not shown.

## Scatter

Scatter plots are a fundamental data visualization technique used to explore the relationship between two numerical variables. By plotting the data points as individual points on a Cartesian coordinate system, scatter plots allow you to visually inspect the presence, direction, and strength of the association between the variables, making them a versatile and widely-used tool for gaining valuable insights about dataset structure and properties.

The following types of scatter plots can be selected. Depending on the type, different options are available.

| Type                 | Options                                                                            |
| :------------------- | :--------------------------------------------------------------------------------- |
| Scatter              | `x-Axis`, `y-Axis`, `Marker Size By`, `Marker Colored By`, `Color Scale`           |
| Scatter (with lines) | `x-Axis`, `y-Axis`, `Marker Size By`, `Marker Colored By`, `Color Scale`           |
| 3D Scatter           | `x-Axis`, `y-Axis`, `z-Axis`, `Marker Size By`, `Marker Colored By`, `Color Scale` |

## Line

Line plots are an essential data visualization technique used to display the relationship between two variables, where one variable is typically plotted along the x-axis and the other is plotted along the y-axis. By connecting the data points with line segments, line plots enable the effective visualization of trends, patterns, and changes over time or across categories, making them a powerful tool for data analysis and communication.

The following types of line plots can be selected. Depending on the type, different options are available.

| Type                            | Options                                                                 |
| :------------------------------ | :---------------------------------------------------------------------- |
| Line                            | `x-Axis`, `y-Axis`, `Line Shape`, `Line Style`                          |
| Line (y-Data only)              | `y-Axis`, `Line Shape`, `Line Style`                                    |
| Lines from Arrays (y-Data only) | `y-Axis`, `Line Shape`, `Line Style`, `Lines Colored By`, `Color Scale` |

## Bar

Bar plots are a ubiquitous data visualization technique that use rectangular bars of varying lengths to compare and contrast values across different categories or groups. They provide an intuitive way to display and compare quantitative information, making them a popular choice for visualizing summary statistics, proportions, and other categorical data.

The following types of bar plots can be selected. Depending on the type, different options are available.

| Type             | Options                                                         |
| :--------------- | :-------------------------------------------------------------- |
| Bar              | `y-Axis`, `Category`, `Error Bars`, `Calculate`, `Display Bars` |
| Bar - horizontal | `x-Axis`, `Category`, `Error Bars`, `Calculate`, `Display Bars` |

## Distribution

Distribution graphs, such as histograms and kernel density plots, are valuable data visualization tools used to depict the underlying distribution of a numerical variable. By representing the frequency or density of data points across different value ranges, distribution graphs allow analysts to identify the central tendency, spread, and shape characteristics of the data, providing key insights into the statistical properties of the variable.

The following types of distribution plots can be selected. Depending on the type, different options are available.

| Type                 | Options                                                                                   |
| :------------------- | :---------------------------------------------------------------------------------------- |
| Histogram            | `x-Axis`                                                                                  |
| Box                  | `y-Axis`, `Outliers`                                                                      |
| Violin               | `y-Axis`                                                                                  |
| 2D Histogram         | `x-Axis`, `y-Axis`, `Gradient`                                                            |
| 2D Contour Histogram | `x-Axis`, `y-Axis`, `Gradient`, `Markers`, `Coloring`, `Labels`, `x- & y-Axis Histograms` |

## Matrix

Scatter Plot Matrices (SPLOMs) are a powerful data visualization technique for exploring relationships between multiple variables. By arranging a grid of pairwise scatter plots, a SPLOM allows users to efficiently analyze the linear and nonlinear associations across all variable combinations, making it a versatile tool for high-dimensional data exploration and pattern discovery.

The following types of matrix plots can be selected. Depending on the type, different options are available.

| Plot  | Options                       |
| :---- | :---------------------------- |
| SPLOM | `Dimensions`, `Show Diagonal` |
