import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Plot from 'react-plotly.js'
import cloneDeep from 'lodash/cloneDeep'
import plotLayout from '../../constants/plot-layout'
import Card from 'react-bootstrap/Card'
import { useSelector, useDispatch } from 'react-redux'
import buildPlot from '../../modules/build-plot'
import { plotUpdate } from '../../features/plot.slice'
import {activeFlags} from '../../store/flags'

const initialGraphSettings = {
  data: [],
  layout: cloneDeep(plotLayout),
  frames: [],
  config: { displayModeBar: false }
}

export default function GraphPanel(props) {
  const { id, content, darkmode, size } = props

  const stateDashboard = useSelector(state => state.dashboard)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)
  const stateFlags = useSelector(state => state.flags)
  const ignore = useSelector(activeFlags);

  const [state, setState] = useState(initialGraphSettings)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isSmall = size.xl < 12
  const sizeScale = isSmall ? 0.75 : 1
  const halfScale = isSmall ? 0.5 : 1

  useEffect(() => {
    const statePlot = buildPlot({
      datasets: stateDatasubsets,
      thresholds: stateThresholds,
      settings: { ...content, legend: false, title: false },
      parameters: stateParameters,
      ignore,
      darkmode
    })

    statePlot.layout.margin = { autoexpand: true, b: 5, l: 5, pad: 0, r: 5, t: 5 }
    statePlot.layout.font = { ...statePlot.layout.font, size: 12 * sizeScale }

    statePlot.data = statePlot.data.map(itm => {
      if (itm?.marker?.colorbar?.thickness)
        itm.marker.colorbar.thickness *= halfScale
      if (itm?.colorbar?.thickness)
        itm.colorbar.thickness *= halfScale
      return itm
    })

    statePlot.data = statePlot.data.map(itm => {
      if (['violin', 'box'].includes(itm?.type) && (itm?.points == 'all' || itm?.boxpoints == 'all') && itm?.marker) {
        itm.marker.size = 6 * halfScale
      }
      if (['scattergl', 'splom'].includes(itm?.type) && itm?.marker) {
        if (itm.marker.size > 0.1 || !itm.marker.size)
          itm.marker.size = 6 * sizeScale
        if (Array.isArray(itm.marker.size))
          itm.marker.size = itm.marker.size.map(el => el * halfScale)
      }
      return itm
    })

    setState({
      ...statePlot,
      frames: [],
      config: {
        displayModeBar: false,
        willReadFrequently: true,
        staticPlot: content.plottype !== 'scatter3d'
      }
    })
  }, [stateParameters, stateDatasubsets, stateThresholds, darkmode, id, size.xl, content, sizeScale, halfScale, stateFlags.checksum])

  const linkToView = useCallback(() => {
    const panelContent = stateDashboard.find(itm => itm.id === id)?.content || {}
    dispatch(plotUpdate({ ...panelContent }))
    navigate('/plot')
  }, [dispatch, navigate, stateDashboard, id])

  return (
    <Card.Body
      onClick={linkToView}
      className="d-flex justify-content-center align-items-center p-1"
      role="button"
    >
      <Plot
        useResizeHandler={true}
        divId={`chart-${id}`}
        style={{ width: "100%", height: "100%" }}
        className="p-0 overflow-hidden h-100"
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        config={state.config}
      />
    </Card.Body>
  )
}