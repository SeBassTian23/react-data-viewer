import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import Plot from 'react-plotly.js'
import cloneDeep from 'lodash/cloneDeep'
import plotLayout from '../../constants/plot-layout'

import Card from 'react-bootstrap/Card'
import { useSelector, useDispatch } from 'react-redux'

import buildPlot from '../../modules/build-plot'
import { plotUpdate } from '../../features/plot.slice'

export default function GraphPanel(props) {
  const stateDashboard = useSelector(state => state.dashboard)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const graphSettings = {
    data: [],
    layout: cloneDeep(plotLayout),
    frames: [],
    config: {
      displayModeBar: false
    }
  }

  const [state, setState] = useState(graphSettings);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {

    const { id, ...content } = props

    let statePlot = buildPlot({
      datasets: stateDatasubsets,   // Data Subsets
      thresholds: stateThresholds,  // Data Thresholds
      settings: { ...content, legend: false, title: false },   // Selections from Modal
      parameters: stateParameters,  // Available Parameters (Column labels)
      darkmode: props.darkmode      // Darkmode active or not
    })

    statePlot.layout.margin = {
      autoexpand: true,
      b: 5,
      l: 5,
      pad: 0,
      r: 5,
      t: 5,
    }

    // Adjust font size for md and sm containers
    statePlot.layout.font = {
      ...statePlot.layout.font,
      size: 12 * (props.size.xl < 12? 0.75 : 1)
    }

    // Adjust colorbar thickness for md and sm containers
    statePlot.data = statePlot.data.map(itm => {
      if(itm?.marker?.colorbar?.thickness)
        itm.marker.colorbar.thickness *= (props.size.xl < 12? 0.5 : 1)
      if(itm?.colorbar?.thickness)
        itm.colorbar.thickness *= (props.size.xl < 12? 0.5 : 1)
      return itm
    })

    setState({
      ...statePlot,
      frames: [],
      config: {
        displayModeBar: false,
        willReadFrequently: true,
        staticPlot: props.plottype == 'scatter3d'? false : true
      }
    });

  }, [stateParameters, stateDatasubsets, stateThresholds, props.darkmode, props.id, props.size.xl]);

  const linkToView = useCallback(
    (props) => {
      const content = stateDashboard.find(itm => itm.id === props.id)?.content || {}
      dispatch(plotUpdate({ ...content }))
      navigate('/plot')
    },
    [dispatch, navigate]
  )

  return (
      <Card.Body
          onClick={() => linkToView(props)}
          className="d-flex justify-content-center align-items-center p-1"
          role="button"
        >
          <Plot
            useResizeHandler={true}
            divId={`chart-${props.id}`}
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
