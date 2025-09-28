import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";

const _getControl = Control.extend({
    options: { position: "topleft", title: "Toggle Marker View", icon: "\u2610" },
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
            .on(link, "click", this._changeView, this);
        return container;
    },
    _changeView: function () {
        this.options.action()
    },
});
const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
