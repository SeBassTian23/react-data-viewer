import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";

const _getControl = Control.extend({
    options: { position: "topleft", title: "Add Panel to Dashboard", icon: "<i class='bi-window-plus' style='font-size:16px'></i>" },
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
            .on(link, "click", this._getView, this);
        return container;
    },
    _getView: function () {
        this.options.action({ bounds: this._map.getBounds(), state: this.options })
        return null;
    },
});
export default createControlComponent((props) => {
    return new _getControl(props)
});
