import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from "leaflet";
import Card from 'react-bootstrap/Card'

import buildGeoJSON from '../../modules/build-geojson';
import { mapLayers } from '../../constants/map-layers'
import { mapApplySettings } from '../../features/map.slice'
import { ColorGradientColorArray } from '../Main/ColorGradient';
import linearColorScale from '../../utils/plot/colorscale-css'

const geojsonMarkerOptions = {
  radius: 4,
  fillColor: "#ff0000",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

// Separate layer component so we can use useMap()
function GeoJSONLayer({ props, datasets, thresholds, parameters }) {
  const geoJsonRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (!geoJsonRef.current) return;

    geoJsonRef.current.clearLayers();

    let { id, bounds, ...stateMap } = props;
    let geoJSON = buildGeoJSON({ datasets, thresholds, parameters, ...stateMap });
    geoJsonRef.current.addData(geoJSON.features);

    // fit bounds if valid
    if (props.bounds && L.latLngBounds(props.bounds).isValid()) {
      map.fitBounds(L.latLngBounds(props.bounds));
    }

    // apply CSS filter if set
    if (stateMap.filter) {
      map.getContainer()
        .querySelector('.leaflet-pane.leaflet-tile-pane')
        .style.filter = stateMap.filter;
    }

    return () => {
      geoJsonRef.current?.clearLayers();
    };
  }, [datasets, thresholds, parameters, props, map]);

  return (
    <GeoJSON
      ref={geoJsonRef}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          ...geojsonMarkerOptions,
          fillColor: feature.properties.fillColor
        })
      }
    />
  );
}

export default function MapPanel(props) {
  const stateThresholds = useSelector(state => state.thresholds);
  const stateDatasubsets = useSelector(state => state.datasubsets);
  const stateParameters = useSelector(state => state.parameters);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkToView = (panelProps) => {
    const { id, ...newobj } = panelProps;
    dispatch(mapApplySettings(newobj));
    navigate('/map');
  };

  const [mapLayer, setMapLayer] = useState(mapLayers[0]);

  useEffect(() => {
    let idx = mapLayers.findIndex(e => e.name === props.layer);
    if (idx >= 0) {
      setMapLayer(mapLayers[idx]);
    }
  }, [props.layer]);

  const style = useMemo(() => ({ width: '100%', height: '100%', minHeight: '100%' }),[] )

  const handleClick = useCallback(() => linkToView(props))

  return (
    <Card.Body
      onClick={handleClick}
      className="d-flex justify-content-center align-items-center p-0 card-img-bottom"
      role="button"
    >
      <MapContainer
        key={props.id}
        center={[0, 0]}
        zoom={0}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        preferCanvas={true}
        renderer={L.canvas()}
        style={style}
      >
        <TileLayer
          attribution={mapLayer.attribution}
          url={mapLayer.url}
          subdomains={mapLayer.subdomains || null}
        />
        <GeoJSONLayer
          props={props}
          datasets={stateDatasubsets}
          thresholds={stateThresholds}
          parameters={stateParameters}
        />
      </MapContainer>
      {(props?.colorBy && props?.colorScale) &&
        <div className="MapPanelScaleGradient" style={{background: linearColorScale( ColorGradientColorArray(props.colorScale) )}}></div>
      }
    </Card.Body>
  );
}
