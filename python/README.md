# Validate Functions

Validate output of statistical and clustering functions using JavaScipt against their established implementation in python packages.

## Statistical Tests

```bash
.
└── stats
```

| Folder         | Tests                                               | Purpose                     |
| -------------- | --------------------------------------------------- | --------------------------- |
| core/          | Student's t, Welch's, ANOVA                         | Parametric hypothesis tests |
| nonparametric/ | Mann-Whitney U, Wilcoxon, Kruskal-Wallis, K-S, Sign | Distribution-free tests     |
| contingency/   | Barnard's, Chi-squared, Fisher's, McNemar's         | Categorical data tests      |
| correlation/   | Pearson, Spearman                                   | Association measures        |

## Clustering Methods

```bash
.
└── clustering
```

| Method  | Purpose                                                                      |
| ------- | ---------------------------------------------------------------------------- |
| k-Means | K-Means groups data into k clusters through iterative centroid optimization. |

## Setup

```bash
conda env create -f environment.yml
```
