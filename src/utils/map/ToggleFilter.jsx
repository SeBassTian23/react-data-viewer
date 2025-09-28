// based on @20tab/react-leaflet-resetview

import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent } from "leaflet";
const _getControl = Control.extend({
    options: { position: "topleft", title: "Show/Hide Grayscale Filter", icon: "<i class='bi-shadows' style='font-size:16px'></i>" },
    onAdd: function (map) {
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
            .on(link, "click", this._toggleFilter, this);
        return container;
    },
    _toggleFilter: function () {
        this.options.action(true)
        return null;
    }
});
const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
