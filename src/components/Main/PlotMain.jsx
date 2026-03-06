import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import Plot from 'react-plotly.js'
import DatumOffCanvas from './DatumOffCanvas'
import buildPlot from '../../modules/build-plot'
import plotLayout from '../../constants/plot-layout'
import { plotUpdate } from '../../features/plot.slice'
import {activeFlags} from '../../store/flags'

const initialGraphSettings = {
  data: [],
  layout: cloneDeep(plotLayout),
  frames: [],
  config: { displayModeBar: true }
}

export default function PlotMain(props) {
  const { darkmode, onSelection, setSelectedMarkers } = props

  const [state, setState] = useState(initialGraphSettings)
  const [datumstate, setDatumstate] = useState(false)
  const [datumid, setDatumid] = useState(null)
  const [bgUpdate, setBgUpdate] = useState(false)

  const statePlot = useSelector(state => state.plot)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)
  const stateFlags = useSelector(state => state.flags)

  const ignore = useSelector(activeFlags);

  const dispatch = useDispatch()

  const showDatum = useCallback((id) => {
    setDatumstate(true)
    setDatumid(id)
  }, [])

  const saveCamera = useCallback((figure) => {
    if (figure?.layout?.scene?.camera) {
      setBgUpdate(true)
      dispatch(plotUpdate({ ...statePlot, camera: figure.layout.scene.camera }))
    }
  }, [statePlot, dispatch])

  const debouncedSaveRef = useRef(debounce(saveCamera, 250))

  useEffect(() => {
    debouncedSaveRef.current = debounce(saveCamera, 250)
    return () => debouncedSaveRef.current.cancel()
  }, [saveCamera])

  useEffect(() => {
    if (bgUpdate) { setBgUpdate(false); return }

    setState({
      ...buildPlot({
        datasets: stateDatasubsets,
        thresholds: stateThresholds,
        settings: { ...statePlot },
        parameters: stateParameters,
        ignore,
        darkmode
      }),
      frames: [],
      config: { displayModeBar: true, willReadFrequently: true }
    })
  }, [stateDatasubsets, stateThresholds, statePlot, stateParameters, stateFlags.checksum, darkmode])

  const handleClick = useCallback((figure) => {
    if (figure.points?.length > 0) {
      const idx = figure.points[0].pointIndex ?? figure.points[0].pointNumber
      const { data } = figure.points[0]
      if (data.idx !== undefined)
        showDatum(Array.isArray(data.idx) ? data.idx[idx] : data.idx)
    }
  }, [showDatum])

  const handleUpdate = useCallback((figure) => {
    if (figure?.layout?.scene) debouncedSaveRef.current(figure)
  }, [])

  const handleDeselect = useCallback(() => {
    onSelection(false)
    setSelectedMarkers([])
  }, [onSelection, setSelectedMarkers])

  const handleSelected = useCallback((eventData) => {
    if (eventData?.points?.length > 0) {
      const ids = eventData.points
        .filter(p => p.pointIndex !== undefined)
        .map(p => p.data.idx[p.pointIndex])
      onSelection(true)
      setSelectedMarkers(ids)
    }
  }, [onSelection, setSelectedMarkers])

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
        onClick={handleClick}
        onUpdate={handleUpdate}
        onDeselect={handleDeselect}
        onSelected={handleSelected}
      />
      <DatumOffCanvas show={datumstate} datumid={datumid} onHide={setDatumstate} darkmode={darkmode} />
    </>
  )
}