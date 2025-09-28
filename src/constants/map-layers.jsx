export const mapLayers = [
  {
    name: 'OpenStreetMap',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c']
  },
  // {
  //   name: 'MapBox',
  //   attribution: '&copy; MapBox',
  //   url: 'https://api.mapbox.com/styles/v1/mapbox/{s}/tiles/{z}/{x}/{y}?access_token=',
  //   subdomains: ['satellite-v9']
  // },
  // {
  //   name: 'Google Streets',
  //   attribution: '&copy; Google',
  //   url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  //   subdomains: ['mt0','mt1','mt2','mt3']
  // },
  // {
  //   name: 'Google Hybrid',
  //   attribution: '&copy; Google',
  //   url: 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
  //   subdomains: ['mt0','mt1','mt2','mt3']
  // },
  // {
  //   name: 'Google Satelite',
  //   attribution: '&copy; Google 2023',
  //   url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  //   subdomains: ['mt0','mt1','mt2','mt3']
  // },
  // Source
  // https://docs.statseeker.com/dashboards/setting-a-map-provider/
  {
    name: 'OpenTopoMap',
    attribution: 'Map Data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, SRTM | Map Style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c']
  },
  {
    name: 'CartoDB',
    attribution: '&copy; CartoDB',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd']
  },
  {
    name: 'CartoDB Positron - light theme',
    attribution: '&copy; CartoDB',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd']
  },
  {
    name: 'CartoDB Positron - dark theme',
    attribution: '&copy; CartoDB',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd']
  },
  {
    name: 'ArcGIS:NatGeo',
    attribution: 'Sources: National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    subdomains: []
  },
  {
    name: 'maps-for-free',
    attribution: '&copy; OpenStreetMap contributors',
    url: 'https://maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg',
    subdomains: []
  },
  {
    name: 'Esri:Topo',
    attribution: 'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg',
    subdomains: []
  },
]