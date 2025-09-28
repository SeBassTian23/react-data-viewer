import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";

const _getControl = Control.extend({
    options: { position: "topleft", title: "Toggle Histogram/Marker View", icon: "\u2610" },
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
        link.innerHTML = '<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 16" style="width: 20px;"><path d="M0 11.015h4.003V16H0zm5-6h4.003V16H5zM10 0h4.011v16H10zm5 5.014h4.004V16H15zm4.996 6.001H24V16h-4.004z"></path></svg>';
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
        this.options.action();
        return null;
    },
});
const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
