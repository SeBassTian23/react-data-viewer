import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";

const buttons = [{
    position: "topleft",
    title: "Filter Data by Area",
    icon: "<i class='bi-bounding-box' style='font-size:16px'></i>",
    action: 'select'
  },{
    position: "topleft",
    title: "Flag Data by Area",
    icon: "<i class='bi-flag-fill' style='font-size:16px'></i>",
    action: 'flag'
  }]

const _getControl = Control.extend({
  options: { position: "topleft" },
  onAdd: function (map) {
    Util.setOptions(this, {
      zoom: map.getZoom(),
      center: map.getCenter(),
    });
    const container = DomUtil.create("div", "leaflet-bar");

    buttons.forEach((btnConfig) => {
      const link = DomUtil.create("a", "", container);
      const linkAttrs = {
        title: btnConfig.title,
        href: "#",
      };
      Object.entries(linkAttrs).forEach(([k, v]) => {
        link.setAttribute(k, v);
      });
      link.innerHTML = btnConfig.icon;
      if (RegExp(/url\(.+\)/).test(btnConfig.icon)) {
        link.innerHTML = "";
        link.style.backgroundImage = btnConfig.icon;
      }
      DomEvent.on(link, "mousedown dblclick", DomEvent.stopPropagation)
        .on(link, "click", DomEvent.stop)
        .on(link, "click", () => this._showModal(btnConfig.action), this);
    });
    
    return container;
  },
  _showModal: function (action) {
    let markerlist = []
    for (let i in this._map._layers) {
      if (this._map._layers[i]._latlng && this._map._layers[i].feature !== undefined) {
        markerlist.push({ ...this._map._layers[i]._latlng, ...{ $loki: this._map._layers[i].feature.properties.$loki } })
      }
    }
    this.options.action({markers: markerlist, action });
    return null;
  },
});

const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
