import GraphPanel from '../components/Widgets/GraphPanel'
import MapPanel from '../components/Widgets/MapPanel'
import ImagePanel from '../components/Widgets/ImagePanel'
import NotesPanel from '../components/Widgets/NotesPanel'

import ANOVAPanel from '../components/Widgets/ANOVAPanel'
import FishersExactPanel from '../components/Widgets/FishersExactPanel'
import ChiSquarePanel from '../components/Widgets/ChiSquaredPanel'
import SummaryPanel from '../components/Widgets/SummaryPanel'
import TTestPanel from '../components/Widgets/TTestPanel'
import BarndardsExactPanel from '../components/Widgets/BarnardsExactPanel'
import MannWhitneyUPanel from '../components/Widgets/MannWhitneyUPanel'
import SignPanel from '../components/Widgets/SignPanel'
import SpearmanCorrelationPanel from '../components/Widgets/SpearmanCorrelationPanel'
import WilcoxonSignedRankPanel from '../components/Widgets/WilcoxonSignedRankPanel'
import McNemarPanel from '../components/Widgets/McNemarPanel'
import KruskalWallisPanel from '../components/Widgets/KruskalWallisPanel'
import WelchsTTestPanel from '../components/Widgets/WelchsTTestPanel'
import PearsonCorrelationPanel from '../components/Widgets/PearsonCorrelationPanel'
import KolmogorovSmirnovPanel from '../components/Widgets/KolmogorovSmirnovPanel'
import KMeansClusterPanel from '../components/Widgets/KMeansClusterPanel'

const widgets = [
  {
    type: "plot",
    name: "Plot",
    category: "external",
    icon: "bi-graph",
    component: GraphPanel, title: null, showEdit: false, anchor: 'graphs',
    tooltip: 'Create interactive visualizations of your data'
  },
  {
    type: "map",
    name: "Map",
    category: "external",
    icon: "bi-map",
    component: MapPanel, title: 'Map', showEdit: false, anchor: 'maps',
    tooltip: 'Visualize geographic data on an interactive map'
  },
  {
    type: "barnardsexact",
    name: "Barnard's Exact Test",
    category: "statistics_category",
    selectType: 'string',
    component: BarndardsExactPanel,
    title: "Barnard's Exact Test",
    showEdit: true,
    anchor: 'barnards-exact-test',
    tooltip: 'Test for associations in small sample categorical data'
  },
  {
    type: "chisquared",
    name: "Chi-Squared Test",
    category: "statistics_category",
    selectType: 'string',
    component: ChiSquarePanel, title: '𝜒²-Test', showEdit: true, anchor: 'chi-squared-test',
    tooltip: 'Test relationships between categorical variables'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: FishersExactPanel, title: "Fisher's Exact Test", showEdit: true, anchor: 'fishers-exact-test',
    tooltip: 'Test for independence in 2x2 contingency tables'
  },
  {
    type: "image",
    name: "Image",
    category: "general",
    icon: "bi-image",
    component: ImagePanel, title: 'Image', showEdit: false, anchor: 'image',
    tooltip: 'Add an image to your analysis'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: KolmogorovSmirnovPanel, title: "Kolmogorov-Smirnov Test", showEdit: true, anchor: 'kolmogorov-smirnov-test',
    tooltip: 'Compare distributions and test goodness-of-fit'
  },
  {
    type: "kruskalwallis",
    name: "Kruskal-Wallis Test",
    category: "statistics_numerical",
    selectType: 'number',
    component: KruskalWallisPanel, title: "Kruskal-Wallis Test", showEdit: true, anchor: 'kruskal-wallis-test',
    tooltip: 'Compare multiple groups without assuming normality'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: MannWhitneyUPanel, title: "Mann-Whitney U Test", showEdit: true, anchor: 'mann-whitney-u-test',
    tooltip: 'Compare two independent groups non-parametrically'
  },
  {
    type: "mcnemar",
    name: "McNemar's Test",
    category: "statistics_category",
    selectType: 'string',
    component: McNemarPanel, title: "McNemar's Test", showEdit: true, anchor: 'mcnemars-test',
    tooltip: 'Test changes in paired categorical outcomes'
  },
  {
    type: "notes",
    name: "Notes",
    category: "general",
    icon: "bi-sticky",
    "content": {
      "text": "**Double click** to start *taking* notes…"
    },
    component: NotesPanel, title: 'Notes', showEdit: false, anchor: 'notes',
    tooltip: 'Add notes and documentation to your analysis'
  },
  {
    type: "anova",
    name: "One-Way ANOVA",
    category: "statistics_numerical",
    selectType: 'number',
    component: ANOVAPanel, title: 'ANOVA', showEdit: true, anchor: 'one-way-anova',
    tooltip: 'Compare means across multiple groups'
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
    },
    component: PearsonCorrelationPanel, title: "Pearson Correlation", showEdit: true, anchor: 'pearson-rank-correlation',
    tooltip: 'Measure linear relationships between variables'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: SignPanel, title: "Sign Test", showEdit: true, anchor: 'sign-test',
    tooltip: 'Test differences without assuming data distribution'
  },
  {
    type: "spearmancorrelation",
    name: "Spearman Rank Correlation",
    category: "statistics_numerical",
    selectType: 'number',
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: SpearmanCorrelationPanel, title: "Spearman Rank Correlation", showEdit: true, anchor: 'spearman-rank-correlation',
    tooltip: 'Measure monotonic relationships between ranked data'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: TTestPanel, title: "Student's t-Test", showEdit: true, anchor: 'students-t-test',
    tooltip: 'Compare two group means for statistical significance'
  },
  {
    type: "summary",
    icon: "bi-clipboard-data",
    name: "Summary",
    category: "statistics",
    component: SummaryPanel, title: 'Summary', showEdit: true, anchor: 'summary',
    tooltip: 'View descriptive statistics of your data'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: WelchsTTestPanel, title: "Welch's t-Test", showEdit: true, anchor: 'welchs-t-test',
    tooltip: 'Compare two groups with unequal variances'
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
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: WilcoxonSignedRankPanel, title: "Wilcoxon Signed Rank Test", showEdit: true, anchor: 'wilcoxon-signed-rank-test',
    tooltip: 'Test paired differences without assuming normality'
  },
  {
    type: "kmeanscluster",
    name: "K-Means Cluster",
    category: "cluster",
    selectType: 'number',
    icon: 'bi-diagram-2',
    comment: 'The cluster will not update on changes',
    component: KMeansClusterPanel, title: "K-Means Clustering", showEdit: false, anchor: 'k-means-clustering',
    tooltip: 'Automatically group data into distinct clusters'
  }
]

// Two-Way ANOVA
// Logistic Regression
// Shapiro-Wilk Test
// Levene's Test

window.widgets = widgets

export default widgets
