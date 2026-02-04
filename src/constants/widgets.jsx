const widgets = [
  {
    type: "barnardsexact",
    name: "Barnard's Exact Test",
    category: "statistics_category",
    selectType: 'string'
  },
  {
    type: "chisquared",
    name: "Chi-Squared Test",
    category: "statistics_category",
    selectType: 'string'
  },
  {
    type: "fishersexact",
    name: "Fisher's Exact Test",
    category: "statistics_category",
    selectType: 'string',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "image",
    name: "Image",
    category: "general",
    icon: "bi-image"
  },
  {
    type: "kolmogorovsmirnov",
    name: "Kolmogorov-Smirnov Test",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "kruskalwallis",
    name: "Kruskal-Wallis Test",
    category: "statistics_numerical",
    selectType: 'number'
  },
  {
    type: "mannwhitneyu",
    name: "Mann-Whitney U Test",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "mcnemar",
    name: "McNemar's Test",
    category: "statistics_category",
    selectType: 'string'
  },
  {
    type: "notes",
    name: "Notes",
    category: "general",
    icon: "bi-sticky",
    "content": {
      "text": "**Double click** to start *taking* notes…"
    }
  },
  {
    type: "anova",
    name: "One-Way ANOVA",
    category: "statistics_numerical",
    selectType: 'number'
  },
  {
    type: "pearsoncorrelation",
    name: "Pearson Rank Correlation",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    }
  },
  {
    type: "sign",
    name: "Sign Test",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "spearmancorrelation",
    name: "Spearman Rank Correlation",
    category: "statistics_numerical",
    selectType: 'number',
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "ttest",
    name: "Student's t-Test",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "summary",
    icon: "bi-clipboard-data",
    name: "Summary",
    category: "statistics"
  },
  {
    type: "welchsttest",
    name: "Welch's t-test",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  },
  {
    type: "wilcoxonsignedrank",
    name: "Wilcoxon Signed Rank",
    category: "statistics_numerical",
    selectType: 'number',
    additionalSelect: {
      values: {
        "two-sided": "two-sided",
        greater: "greater",
        less: "less"
      },
      defaultValue: "two-sided",
      register_name: "alternative",
      title: "Alternative"
    },
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.'
  }
]

// Two-Way ANOVA
// Logistic Regression
// Shapiro-Wilk Test
// Levene's Test

export default widgets
