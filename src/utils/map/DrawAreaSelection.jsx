import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";

const _getControl = Control.extend({
  options: { position: "topleft", title: "Filter Data by Area", icon: "<i class='bi-bounding-box' style='font-size:16px'></i>" },
  onAdd: function (map) {
    Util.setOptions(this, {
      zoom: map.getZoom(),
      center: map.getCenter(),
    });
    const { title, icon } = this.options;
    const container = DomUtil.create("div", "leaflet-bar");
    const link = DomUtil.create("a", "", container);
    const linkAttrs = {
      title,
      href: "#",
    };
    Object.entries(linkAttrs).forEach(([k, v]) => {
      link.setAttribute(k, v);
    });
    link.innerHTML = icon;
    if (RegExp(/url\(.+\)/).test(icon)) {
      link.innerHTML = "";
      link.style.backgroundImage = icon;
    }
    DomEvent.on(link, "mousedown dblclick", DomEvent.stopPropagation)
      .on(link, "click", DomEvent.stop)
      .on(link, "click", this._showModal, this);
    return container;
  },
  _showModal: function () {
    let markerlist = []
    for (let i in this._map._layers) {
      if (this._map._layers[i]._latlng && this._map._layers[i].feature !== undefined) {
        markerlist.push({ ...this._map._layers[i]._latlng, ...{ $loki: this._map._layers[i].feature.properties.$loki } })
      }
    }
    this.options.action(markerlist);
    return null;
  },
});

const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
