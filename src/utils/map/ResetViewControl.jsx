// based on @20tab/react-leaflet-resetview

import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";
const _getControl = Control.extend({
    options: { position: "topleft", title: "Reset map view", icon: "<i class='bi-arrows-angle-expand' style='font-size:16px'></i>" },
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
            .on(link, "click", this._resetView, this);
        return container;
    },
    _resetView: function () {
        let markerlist = []
        for (let i in this._map._layers) {
            if (this._map._layers[i]._latlng)
                markerlist.push(this._map._layers[i]._latlng)
        }
        if (markerlist.length > 0) {
            this._map.fitBounds(markerlist);
        }
        return null;
    }
});
const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
