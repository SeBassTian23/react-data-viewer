# Dashboard

The Dashboard is your central workspace for data analysis visualization. It provides a flexible canvas where you can arrange multiple panels containing graphs, maps, and widgets to present your analysis results.

## Panels

Panels are containers that display visualizations and analysis tools. Their content updates automatically when you:

- Filter the dataset
- Add, remove, edit, or hide subsets
- Adjust thresholds

### Adding Panels

You can add panels in several ways:

- From Graph View: Create and add graphs using the Dashboard button
- From Map View: Create and add maps using the Dashboard button
- From Sidebar: Use the Panels dropdown menu to add widgets (only available in Dashboard view)

New panels are automatically placed in the top-left corner of the dashboard.

### Arrange Panels

Each panel offers several management options:

- Drag panels using the handle (⋮⋮) on the left side of the panel header
- Panels automatically reflow to fill available space

### Panel Menu [⋮]

- `Edit`: Modify widget settings (available for supported widgets)
- `Delete`: Remove panel from dashboard
- `Copy`: Copy panel content to clipboard
- `Size`: Adjust panel width
  - Default: ⅓ screen width
  - Large: ½ screen width
  - Full Width: Entire screen width
- `Help`: Display quick help guide

## Widgets

Widgets are interactive tools which can be added as panels to the dashboard and that enhance your data analysis capabilities. Each can be added multiple times to help compare different parameters.

- Add widgets through the Panels dropdown in the sidebar
- Only available in Dashboard view
- Some widgets (Graph, Map) must be added from their respective views
- Widget settings can be edited, but previous settings are not preserved

### General

#### Graphs

- Added from Graph View
- Update dynamically during analysis
- Click to open in Graph View
- Can be copied as images for external use
- Cannot be edited once added

#### Maps

- Added from Map View
- Update dynamically during analysis
- Click to open in Map View
- Cannot be edited once added

#### Notes

- Simple text editor for dashboard annotations
- Click inside to edit, outside to save

#### Image

- Supports various formats: `.jpg/.jpeg`, `.png`, `.tif/.tiff`, `.gif`, `.svg`, `.webp`
- Import and display images directly on dashboard

### Summary Statistics

#### Summary

Basic descriptive measures of data that calculate mean, median, mode, standard deviation, and quartiles. This foundational analysis is essential for initial data exploration, helping you understand data distribution patterns and central tendencies before applying more advanced statistical tests.

- Sample Size
- Median
- Average (with Confidence Interval)
- Standard Deviation
- Standard Error
- Minimum/Maximum values
- Sum

For filtered datasets, summaries are provided per subset. Empty subsets are clearly marked.

### Numerical Data Tests

#### Kolmogorov-Smirnov Test
A non-parametric test that compares empirical distributions to theoretical distributions (one-sample) or compares two sample distributions (two-sample). It works by measuring the maximum difference between cumulative distribution functions and is distribution-free, making no assumptions about underlying data distributions. It's commonly used for normality testing and comparing whether two groups come from the same underlying population.

#### Kruskal-Wallis Test
A non-parametric alternative to ANOVA that compares distributions across multiple independent groups without assuming normal distribution. This test ranks all data points together and compares rank sums between groups, making it ideal for multiple group comparisons when data is not normally distributed, ordinal in nature, or when sample sizes are unequal.

#### Mann-Whitney U Test
A non-parametric alternative to the independent samples t-test that compares the distributions of two independent groups. Unlike parametric tests, it doesn't assume normal distribution and works by ranking all observations together, then comparing the sum of ranks between groups. This makes it perfect for comparing groups when data is not normally distributed, contains outliers, or consists of ordinal measurements.

#### One-Way ANOVA
A parametric test that compares means across three or more groups, assuming normal distribution and equal variances. ANOVA tests whether there are statistically significant differences between group means by analyzing the variance within groups versus between groups. It's commonly used for testing if treatment effects differ across multiple conditions or comparing performance across different categories.

#### Pearson Rank Correlation
A parametric test that measures the strength and direction of linear relationships between two continuous variables. It produces a correlation coefficient (r) ranging from -1 to +1, where values closer to ±1 indicate stronger linear associations. The test also provides significance testing to determine if the observed correlation is statistically different from zero, commonly used in exploratory data analysis and assumption checking for regression models.

#### Sign Test
The simplest non-parametric test for paired data that counts positive and negative differences between paired observations. It tests whether the median difference equals zero by examining only the direction of change, ignoring magnitude. This makes it extremely robust to outliers and perfect for quick paired comparisons when you only care about the direction of change, not its size.

#### Spearman Rank Correlation
A non-parametric correlation coefficient that measures the strength and direction of monotonic relationships between two variables. Unlike Pearson correlation, it works with ranked data and doesn't assume linear relationships, making it suitable for ordinal data, non-linear relationships, or when data contains outliers that might distort parametric correlations.

#### Student's *t*-Test
A parametric test that compares means between one or two groups, assuming normal distribution and equal variances. The t-test calculates how many standard errors the observed difference is from zero, making it ideal for comparing average performance between two groups, conducting before/after comparisons, or testing if a sample mean differs significantly from a known population mean.

#### Welch's t-Test
A parametric test that compares means between two independent groups without assuming equal variances. Also known as the unequal variances t-test, it uses the Welch-Satterthwaite equation to calculate degrees of freedom when sample variances differ substantially. It's more robust than the standard t-test when the equal variances assumption is violated, making it safer for real-world data analysis.

#### Wilcoxon Signed Rank Test
A non-parametric test for paired samples that considers both the direction and magnitude of differences between paired observations. Unlike the sign test, it ranks the absolute differences and uses these ranks in the analysis, providing more statistical power while remaining robust to non-normal distributions. It's perfect for before/after comparisons when data doesn't meet the assumptions required for a paired t-test.

### Categorical Data Tests

#### Barnard's Exact Test
An unconditional exact test for 2×2 contingency tables that provides more statistical power than Fisher's exact test by not conditioning on both marginal totals. This test examines all possible tables with the same row totals and finds the most extreme evidence against the null hypothesis. It's particularly valuable when testing association in 2×2 tables and you want maximum statistical power, especially with small to moderate sample sizes.

#### Chi-Squared Test
A non-parametric test that examines the independence between categorical variables by comparing observed frequencies to expected frequencies under the assumption of independence. The test calculates how much the observed data deviates from what would be expected if there were no association between variables. It's widely used for analyzing survey responses, testing relationships between categorical variables, and examining goodness-of-fit to expected distributions.

#### Fisher's Exact Test
An exact test specifically designed for 2×2 contingency tables that provides precise p-values without relying on large-sample approximations. This test is particularly valuable when sample sizes are small and expected cell frequencies are less than 5, conditions where the chi-squared test may not be reliable. It calculates exact probabilities using the hypergeometric distribution, making it the gold standard for small-sample categorical data analysis.

#### McNemar's Test
A specialized test for paired categorical data that focuses on changes or disagreements between two related measurements on the same subjects. Unlike other categorical tests, McNemar's test specifically examines the discordant pairs (where responses changed) while ignoring concordant pairs. This makes it perfect for before/after comparisons with categorical outcomes, such as treatment effectiveness, opinion changes, or diagnostic test comparisons.