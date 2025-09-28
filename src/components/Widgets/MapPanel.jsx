import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import buildGeoJSON from '../../modules/build-geojson';

import { useSelector, useDispatch } from 'react-redux'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import L from "leaflet";

import { mapLayers } from '../../constants/map-layers'

import { mapApplySettings } from '../../features/map.slice'

import chroma from 'chroma-js'
import jStat from 'jstat'

import { ColorGradientColorArray } from '../Main/ColorGradient';
import { calculateBins } from '../../utils/plot/histogram'

import Card from 'react-bootstrap/Card'

var geojsonMarkerOptions = {
  radius: 4,
  fillColor: "#ff0000",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

export default function MapPanel(props) {

  const geoJsonRef = useRef()
  const mapRef = useRef()

  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const dispatch = useDispatch()

  const navigate = useNavigate();
  const linkToView = ((props) => {
    const { id, ...newobj } = props
    dispatch(mapApplySettings(newobj))
    navigate('/map')
  })

  const [map, setMap] = useState(false)
  const [mapLayer, setMapLayer] = useState(mapLayers[0])

  useEffect(() => {

    if (geoJsonRef.current) {

      // remove old data
      geoJsonRef.current.clearLayers()
      let { id, bounds, ...stateMap } = props
      let geoJSON = buildGeoJSON({ datasets: stateDatasubsets, thresholds: stateThresholds, parameters: stateParameters, ...stateMap })
      geoJsonRef.current.addData(geoJSON.features)

      if (props.bounds && L.latLngBounds(props.bounds).isValid()) {
        geoJsonRef.current._map.fitBounds(L.latLngBounds(props.bounds))
      }

      if (stateMap.filter) {
        geoJsonRef.current._map._container.querySelector('.leaflet-pane.leaflet-tile-pane').style.filter = stateMap.filter;
      }

      if (props.colorType === 'histogram') {

        let colorValues = geoJSON.features.map(item => item.properties.colorValue)

        let scale = ColorGradientColorArray(stateMap.colorScale)

        let f = chroma.scale(scale).domain([jStat(colorValues).min(), jStat(colorValues).max()]);

        let bins = calculateBins(colorValues)
        let colorbars = []
        let nextbin = bins.start
        while (nextbin <= bins.end) {
          colorbars.push(f(nextbin).hex())
          nextbin += bins.size
        }
      }

      let idx = mapLayers.findIndex(e => e.name === props.layer)
      if (idx)
        setMapLayer(mapLayers[idx])

    }
    else {
      setMap(true)
    }
  }, [stateDatasubsets, stateThresholds, stateParameters, map])

  return (
    <Card.Body onClick={() => linkToView(props)} className='d-flex justify-content-center align-items-center p-0 card-img-bottom'>
      <MapContainer ref={mapRef} center={[0, 0]} zoom={0} zoomControl={false} dragging={false} scrollWheelZoom={false} preferCanvas={true} renderer={L.canvas()} style={{ 'width': '100%', 'height': '100%', 'minHeight': '100%', 'cursor': 'pointer' }}>
        <TileLayer attribution={mapLayer.attribution} url={mapLayer.url} subdomains={mapLayer.subdomains || null} />
        <GeoJSON ref={geoJsonRef} pointToLayer={(feature, latlng) => L.circleMarker(latlng, { ...geojsonMarkerOptions, ...{ fillColor: feature.properties.fillColor } })} />
      </MapContainer>
    </Card.Body>
  )
}
