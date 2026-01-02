import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import cloneDeep from 'lodash/cloneDeep'

import Plot from 'react-plotly.js'

import DatumOffCanvas from './DatumOffCanvas'

import buildPlot from '../../modules/build-plot'
import plotLayout from '../../constants/plot-layout'


export default function PlotMain(props) {

  const graphSettings = {
    data: [],
    layout: cloneDeep(plotLayout),
    frames: [],
    config: {
      displayModeBar: true
    }
  }

  const [state, setState] = useState(graphSettings);

  const statePlot = useSelector(state => state.plot)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const [datumstate, setDatumstate] = useState(false)
  const [datumid, setDatumid] = useState(null)
  const [darkmode, setDarkmode] = useState(false)

  const showDatum = (id) => {
    setDatumstate(true)
    setDatumid(id)
  }

  useEffect(() => {

    setDarkmode(props.darkmode);

    let newState = buildPlot({
      datasets: stateDatasubsets,   // Data Subsets
      thresholds: stateThresholds,  // Data Thresholds
      settings: { ...statePlot },   // Selections from Modal
      parameters: stateParameters,  // Available Parameters (Column labels)
      darkmode: props.darkmode      // Darkmode active or not
    })

    setState({
      ...newState,
      frames: [],
      config: {
        displayModeBar: true,
        willReadFrequently: true
      }
    });

  }, [stateDatasubsets, stateThresholds, statePlot, stateParameters, props.darkmode]);

  return (
    <>
      <Plot
        useResizeHandler={true}
        divId="mainChart"
        style={{ width: "100%", height: "100%" }}
        className="col-12 p-0 overflow-hidden h-100"
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        config={state.config}
        onClick={(figure) => {
          if (figure.points !== undefined && figure.points.length > 0) {
            let idx = figure.points[0].pointIndex || figure.points[0].pointNumber;
            if (figure.points[0].data.idx && figure.points[0].data.idx !== undefined)
              showDatum(figure.points[0].data.idx[idx] || null)
          }
        }
        }
        onUpdate={(figure) => {
          // console.log('onUpdate')
          // console.log('Current Plot:', figure);
          // console.log('State:', state);
        }}
        onDeselect={(eventData) => {
          props.onSelection(false);
          props.setSelectedMarkers([])
        }
        }
        onSelected={(eventData) => {
          let ids = [];
          if (eventData && eventData.points !== undefined && eventData.points.length > 0) {
            eventData.points.forEach(point => {
              if (point.pointIndex !== undefined) {
                let idx = point.pointIndex
                ids.push(point.data.idx[idx])
              }
            })
            props.onSelection(true);
            props.setSelectedMarkers(ids);
          }
        }
        }
      />
      <DatumOffCanvas show={datumstate} datumid={datumid} onHide={setDatumstate} darkmode={`${props.darkmode}`} />
    </>
  )
}