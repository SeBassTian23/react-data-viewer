import { useRef, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'

import { MapContainer, TileLayer, LayersControl, FeatureGroup, LayerGroup, GeoJSON, ScaleControl } from 'react-leaflet'
import { useMapEvents } from 'react-leaflet/hooks'
import L from "leaflet";

import ResetViewControl from '../utils/map/ResetViewControl';
import HeatmapControl from '../utils/map/HeatmapControl'
import MarkerPinsControl from '../utils/map/MarkerPinsControl'
import DashboardControl from '../utils/map/DashboardControl'
import DrawAreaSelection from '../utils/map/DrawAreaSelection'
import HelpControl from '../utils/map/HelpControl'

import merge from 'lodash/merge'

import { EditControl } from "react-leaflet-draw-next"

import { mapLayers } from '../constants/map-layers'

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import '@bopen/leaflet-area-selection/dist/index.css';

import Plot from 'react-plotly.js'

import chroma from 'chroma-js'
import jStat from 'jstat'

import { ColorGradientColorArray } from '../components/Main/ColorGradient';

import buildGeoJSON from '../modules/build-geojson';
import { getDatasetCount } from '../modules/database'

import { calculateBins } from '../utils/plot/histogram'
import plotMapLayout from '../constants/plot-map-layout'

import DatumOffCanvas from '../components/Main/DatumOffCanvas'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

import { mapShowSeries, mapShowHistogram, mapApplyHistogramRange, mapApplySettings } from '../features/map.slice'
import { dashboardAddPanel } from '../features/dashboard.slice';

import ToggleFilter from '../utils/map/ToggleFilter';

import { plotLayoutDarkmode, plotLayoutLightmode } from '../constants/plot-layout'

import { fixRectangle, fixCircle } from '../utils/map/fixes'

import ModalDialogMapHistogram from '../components/Dialogs/ModalDialogMapHistogram'
import ModalDialogMapAreaSelect from '../components/Dialogs/ModalDialogMapAreaSelect'

import useToast from "../hooks/useToast"; 
import useHelp from '../hooks/useHelp';

// Apply fixes
L.GeometryUtil = fixRectangle();
L.Edit.Circle = fixCircle();

function LayerChanges(props) {
  const dispatch = useDispatch();
  useMapEvents({
    baselayerchange: (e) => {
      dispatch(dispatch(mapApplySettings({ layer: e.name })));
    },
    moveend: (e) => {
      const { _southWest, _northEast } = e.target.getBounds();
      const bounds = [
        [_southWest.lat, _southWest.lng],
        [_northEast.lat, _northEast.lng]
      ]
      dispatch(mapApplySettings({ bounds }));
    },
  })
  return null
}

export default function Map(props) {

  const geojsonMarkerOptions = {
    radius: 6,
    fillColor: "#ff0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateMap = useSelector(state => state.map)

  const store = useStore();

  const dispatch = useDispatch();

  const toast = useToast();
  const help = useHelp();

  const geoJsonRef = useRef()
  const mapRef = useRef()
  const editRef = useRef();

  const [datumid, setDatumid] = useState(null)
  const [datumstate, setDatumstate] = useState(false)

  const [histogramstate, setHistogramstate] = useState(false)

  const [areaselectstate, setAreaselectstate] = useState(false)
  const [areaselectedstate, setAreaselectedstate] = useState(null)

  const [plotdisplay, setPlotdisplay] = useState('none')
  const [plotstate, setPlotstate] = useState({ data: [], layout: plotMapLayout, frames: [], config: { displayModeBar: false } })

  const [resize, setResize] = useState(true)

  const showDatum = (id) => {
    setDatumid(id)
    setDatumstate(true)
  }

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Maps", "help/md/map.md")
  },[] )

  const handleClickDashboard = useCallback( ()=> {
    
    const props = store.getState().map
    const parameterName = store.getState().parameters.find(itm => itm.name == props.colorBy)?.alias || props.colorBy

    dispatch(dashboardAddPanel({
      content: props,
      linkTo: null,
      title: `Map${props.colorType === 'histogram' && ` | ${parameterName}`}`,
      type: "map"
    })
    )
    toast.info("Map added to Dashboard", "Dashboard", "bi-window-plus");

  },[] )

  const hideDatum = () => setDatumstate(false)
  const hideHistogramModal = () => setHistogramstate(false)
  const hideAreaSelectModal = () => setAreaselectstate(false)

  const toggleGrayscale = () => {
    const props = store.getState().map;
    dispatch(mapApplySettings({ filter: props?.filter === 'grayscale(0)' ? 'grayscale(1)' : 'grayscale(0)' }));
  }

  useEffect(() => {

    
    if (geoJsonRef.current) {
      
      // Clear all old data
      geoJsonRef.current.clearLayers()

      let valueType = stateParameters.find(e => e.name === stateMap.colorBy) || null

      valueType = valueType ? valueType.specialtype ? valueType.specialtype : valueType.type : null

      // Add GeoJSON data
      let geoJSON = buildGeoJSON({ datasets: stateDatasubsets, thresholds: stateThresholds, parameters: stateParameters, valueType, ...stateMap })
      geoJsonRef.current.addData(geoJSON.features)

      // Apply saved map bounds
      if (stateMap.bounds && L.latLngBounds(stateMap.bounds).isValid()) {
        geoJsonRef.current._map.fitBounds(L.latLngBounds(stateMap.bounds),{
          maxZoom: 18
        })
      }
      // Zoom in to data if no bounds exist
      // This should cover the initial state just using the preset zoom level
      if (stateMap.bounds.length == 0 && getDatasetCount() > 0 && geoJSON?.features.length > 0){
        geoJsonRef.current._map.fitBounds(L.latLngBounds(geoJsonRef.current.getBounds()),{
          maxZoom: 18
        })
      }

      if (stateMap.colorType === 'series') {
        setPlotdisplay('none')
      }

      if (stateMap.filter) {
        geoJsonRef.current._map._container.querySelector('.leaflet-pane.leaflet-tile-pane').style.filter = stateMap.filter;
      }

      if (stateMap.colorType === 'histogram') {

        let colorValues = geoJSON.features.map(item => item.properties.colorValue)

        let scale = ColorGradientColorArray(stateMap.colorScale)

        let f = chroma.scale(scale).domain([jStat(colorValues).min(), jStat(colorValues).max()]);

        let bins = calculateBins(colorValues)
        let colorbars = []
        let nextbin = bins.start
        if(bins.size == 0)
          colorbars.push(f(nextbin).hex())
        else
          while (nextbin <= bins.end) {
            colorbars.push(f(nextbin).hex())
            nextbin += bins.size
          }

        const value = stateParameters.find(e => e.name === stateMap.colorBy).alias || stateMap.colorBy

        setPlotdisplay('block')
        setPlotstate(previous => {
          let layout = plotMapLayout;
          layout.title.text = value
          layout['font'] = {color: props.darkmode ? plotLayoutDarkmode.font.color : plotLayoutLightmode.font.color}

          if (valueType === 'date-time') {
            layout.xaxis.type = "date";
            layout.xaxis.tickformat = "%Y-%m-%d";
          }

          layout.xaxis = merge(layout.xaxis, props.darkmode ? plotLayoutDarkmode.xaxis : plotLayoutLightmode.xaxis);
          layout.yaxis = merge(layout.yaxis, props.darkmode ? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis);

          return {
            data: [
              {
                "x": colorValues,
                "name": value,
                "marker": {
                  "color": colorbars,
                  "line": {
                    "color": '#000',
                    "width": 1
                  },
                  "pattern": {
                    "shape": 'square'
                  }
                },
                "type": "histogram",
                "visible": true,
                "autobinx": false,
                "xbins": bins
              }
            ],
            layout,
            frames: []
          }
        })
      }
    }
  }, [
    stateParameters,
    stateDatasubsets,
    stateThresholds,
    stateMap.colorBy,
    stateMap.colorScale,
    stateMap.colorRange,
    stateMap.colorType,
    stateMap.filter,
    stateMap.layer,
    geoJsonRef.current,
    props.darkmode,
    resize
  ]);

  return (
    <>
      <Row className='h-100 p-0'>
        <MapContainer ref={mapRef} center={[0, 0]} zoom={2} scrollWheelZoom={false} preferCanvas={true} renderer={L.canvas()}>

          <LayerChanges />

          {mapRef.current &&
            <LayersControl position="topright">
              {mapLayers.map((layer, idx) =>
                <LayersControl.BaseLayer key={idx} name={layer.name} checked={layer.name === stateMap.layer} >
                  <LayerGroup>
                    <TileLayer attribution={layer.attribution} url={layer.url} subdomains={layer.subdomains || null} />
                  </LayerGroup>
                </LayersControl.BaseLayer>
              )}
            </LayersControl>
          }

            <LayerGroup>
              <GeoJSON ref={geoJsonRef} pointToLayer={(feature, latlng) => L.circleMarker(latlng, { ...geojsonMarkerOptions, ...{ fillColor: feature.properties.fillColor } })} eventHandlers={{ click: (e) => showDatum(e.sourceTarget.feature.properties.$loki) }} />
            </LayerGroup>

            <FeatureGroup ref={editRef}>
              {editRef.current && <>
                <EditControl
                  position='topleft'
                  draw={{
                    circlemarker: false,
                    marker: false,
                    polyline: false
                  }}
                  featureGroup={editRef.current}
                />
                <DrawAreaSelection action={(e) => { setAreaselectstate(true); setAreaselectedstate(e); }} areaselectedstate={areaselectedstate} />
                </>
              }
            </FeatureGroup>
            
            {editRef.current && <>
              <FeatureGroup>
                <ResetViewControl />
                <MarkerPinsControl action={() => dispatch(mapShowSeries())} title="Marker | Series" icon="<i class='bi-geo-alt-fill' style='font-size:16px'></i>" />
                <HeatmapControl action={() => setHistogramstate(true)} title="Marker | Heatmap" icon="<i class='bi-bar-chart-line-fill' style='font-size:16px'></i>" />
                <ToggleFilter action={(e) => toggleGrayscale()} />
              </FeatureGroup>

              <DashboardControl action={handleClickDashboard} title="Add Map View to Dashboard" />

              <HelpControl action={handleClickHelp} />
            </>
            }

          <ScaleControl position='bottomleft' />
        </MapContainer>

        <Card className={`map-histogram-card d-${plotdisplay} ${resize ? 'map-histogram-card-sm' : 'map-histogram-card-lg'}`}>
          <Button size={'sm'} variant='link' className='map-resize-chart-btn' onClick={() => setResize(!resize)}>
            {resize ? <i className='bi bi-arrow-up-left-square' /> : <i className='bi bi-arrow-down-right-square' />}
          </Button>
          <Plot
            className="p-0 card-body w-100 h-100"
            useResizeHandler={true}
            divId="mapChart"
            data={plotstate.data}
            layout={plotstate.layout}
            frames={plotstate.frames}
            config={plotstate.config}
            // onInitialized={(figure) => setPlotstate(figure)}
            onUpdate={(figure) => {
              // setPlotstate(figure)
              // console.log(figure)
            }}
            onRelayout={(figure) => {
              let range = null
              if (figure['xaxis.range[0]'] !== undefined) {
                range = [figure['xaxis.range[0]'], figure['xaxis.range[1]']]
              }
              dispatch(mapApplyHistogramRange({ colorRange: range }))
            }}
          />
        </Card>
      </Row>
      <DatumOffCanvas onHide={hideDatum} show={datumstate} datumid={datumid} darkmode={`${props.darkmode}`} />
      <ModalDialogMapHistogram onHide={hideHistogramModal} show={histogramstate} action={() => mapShowHistogram()} />
      <ModalDialogMapAreaSelect onHide={hideAreaSelectModal} show={areaselectstate} editRef={editRef} areaselectedstate={areaselectedstate} mapRef={mapRef} />
    </>
  )
}
