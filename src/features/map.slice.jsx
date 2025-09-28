import { createSlice } from '@reduxjs/toolkit'
import { mapLayers } from '../constants/map-layers'

const initialState = {
  colorBy: null,
  colorScale: null,
  colorRange: null,
  colorType: 'series',
  bounds: [
    [-72.2, -132.5],
    [84.3, 150.0]
  ],
  filter: 'grayscale(1)',
  layer: mapLayers.find(itm => itm.name === 'OpenStreetMap').name || mapLayers[0].name,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    mapShowHistogram(state, action) {
      return { ...state, ...action.payload }
    },
    mapApplyHistogramRange(state, action) {
      return { ...state, ...action.payload }
    },
    mapShowSeries(state, action) {
      return { ...state, colorType: 'series', colorScale: null, colorRange: null, colorBy: null }
    },
    mapApplySettings(state, action) {
      return { ...state, ...action.payload }
    },
    mapReset(state, action) {
      return initialState;
    }
  }
})

export const { mapShowHistogram, mapShowSeries, mapApplyHistogramRange, mapApplySettings, mapReset } = mapSlice.actions
export default mapSlice.reducer
