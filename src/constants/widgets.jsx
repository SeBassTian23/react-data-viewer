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
    category: "general",
    icon: "bi-graph",
    component: GraphPanel, title: null, showEdit: false, anchor: 'graphs'
  },
  {
    type: "map",
    name: "Map",
    category: "general",
    icon: "bi-map",
    component: MapPanel, title: 'Map', showEdit: false, anchor: 'maps'
  },
  {
    type: "barnardsexact",
    name: "Barnard's Exact Test",
    category: "statistics_category",
    selectType: 'string',
    component: BarndardsExactPanel,
    title: "Barnard's Exact Test",
    showEdit: true,
    anchor: 'barnards-exact-test'
  },
  {
    type: "chisquared",
    name: "Chi-Squared Test",
    category: "statistics_category",
    selectType: 'string',
    component: ChiSquarePanel, title: '𝜒²-Test', showEdit: true, anchor: 'chi-squared-test'
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
    component: FishersExactPanel, title: "Fisher's Exact Test", showEdit: true, anchor: 'fishers-exact-test'
  },
  {
    type: "image",
    name: "Image",
    category: "general",
    icon: "bi-image",
    component: ImagePanel, title: 'Image', showEdit: false, anchor: 'image'
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
    component: KolmogorovSmirnovPanel, title: "Kolmogorov-Smirnov Test", showEdit: true, anchor: 'kolmogorov-smirnov-test'
  },
  {
    type: "kruskalwallis",
    name: "Kruskal-Wallis Test",
    category: "statistics_numerical",
    selectType: 'number',
    component: KruskalWallisPanel, title: "Kruskal-Wallis Test", showEdit: true, anchor: 'kruskal-wallis-test'
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
    component: MannWhitneyUPanel, title: "Mann-Whitney U Test", showEdit: true, anchor: 'mann-whitney-u-test'
  },
  {
    type: "mcnemar",
    name: "McNemar's Test",
    category: "statistics_category",
    selectType: 'string',
    component: McNemarPanel, title: "McNemar's Test", showEdit: true, anchor: 'mcnemars-test'
  },
  {
    type: "notes",
    name: "Notes",
    category: "general",
    icon: "bi-sticky",
    "content": {
      "text": "**Double click** to start *taking* notes…"
    },
    component: NotesPanel, title: 'Notes', showEdit: false, anchor: 'notes'
  },
  {
    type: "anova",
    name: "One-Way ANOVA",
    category: "statistics_numerical",
    selectType: 'number',
    component: ANOVAPanel, title: 'ANOVA', showEdit: true, anchor: 'one-way-anova'
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
    component: PearsonCorrelationPanel, title: "Pearson Correlation", showEdit: true, anchor: 'pearson-rank-correlation'
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
    component: SignPanel, title: "Sign Test", showEdit: true, anchor: 'sign-test'
  },
  {
    type: "spearmancorrelation",
    name: "Spearman Rank Correlation",
    category: "statistics_numerical",
    selectType: 'number',
    comment: 'Creates tests for all 2x2 combinations between subsets and selected parameter.',
    component: SpearmanCorrelationPanel, title: "Spearman Rank Correlation", showEdit: true, anchor: 'spearman-rank-correlation'
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
    component: TTestPanel, title: "Student's t-Test", showEdit: true, anchor: 'students-t-test'
  },
  {
    type: "summary",
    icon: "bi-clipboard-data",
    name: "Summary",
    category: "statistics",
    component: SummaryPanel, title: 'Summary', showEdit: true, anchor: 'summary'
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
    component: WelchsTTestPanel, title: "Welch's t-Test", showEdit: true, anchor: 'welchs-t-test'
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
    component: WilcoxonSignedRankPanel, title: "Wilcoxon Signed Rank Test", showEdit: true, anchor: 'wilcoxon-signed-rank-test'
  },
  {
    type: "kmeanscluster",
    name: "K-Means Cluster",
    category: "cluster",
    selectType: 'number',
    comment: 'The cluster will not update on changes',
    component: KMeansClusterPanel, title: "K-Means Clustering", showEdit: false, anchor: 'k-means-clustering'
  }
]

// Two-Way ANOVA
// Logistic Regression
// Shapiro-Wilk Test
// Levene's Test

export default widgets
