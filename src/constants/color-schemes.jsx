import { defaults as colors } from 'plotly.js/src/components/color/attributes.js'

const colorSchemes = {
  'default': colors,
  'tab10new': [
    '#4e79a7',
    '#f28e2b',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc948',
    '#b07aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ac'
  ],
  'ggplot': [
    '#F8766D',
    '#7CAE00',
    '#00BFC4',
    '#C77CFF',
    '#FCAE91',
    '#FFB3E6',
    '#A1CAF1',
    '#C2B280',
    '#848482',
    '#00868B'
  ],
  'excel': [
    '#4472C4',
    '#ED7D31',
    '#A5A5A5',
    '#FFC000',
    '#5B9BD5',
    '#70AD47',
    '#264478',
    '#9E480E',
    '#636363',
    '#7F6084'
  ],
  'looker': [
    '#509EE3',
    '#2EB67D',
    '#E01E5A',
    '#ECB22E',
    '#8858A5',
    '#3BB9FF',
    '#7DCEA0',
    '#F8CB7F',
    '#85C1E9',
    '#F1948A'
  ],
  'qliksense': [
    '#00A3E0',
    '#006DAF',
    '#7DB8DA',
    '#4D4D4D',
    '#B6B6B6',
    '#FF8000',
    '#94C476',
    '#D6604D',
    '#8E4585',
    '#F1C232'
  ]
}

export default colorSchemes

export const colorSchemeNames = {
  'default': 'Tableau 10',
  'tab10new': 'Tableau 10 ᴺᴱᵂ',
  'ggplot': 'Ggplot2',
  'excel': 'MS Excel',
  'looker': 'Looker Studio',
  'qliksense': 'Qlik Sense'
}