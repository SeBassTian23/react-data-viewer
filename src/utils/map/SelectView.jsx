// based on @20tab/react-leaflet-resetview

import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent } from "leaflet";

const _getControl = Control.extend({
    options: { position: "topleft" },
    getButtons: function() {
        return [
            {
                title: "Color by Data-Subset",
                icon: "<i class='bi-geo-alt-fill' style='font-size:16px'></i>",
                action: this._changeView
            },
            {
                title: "Color by Histogram",
                icon: '<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 16" style="width: 20px;"><path d="M0 11.015h4.003V16H0zm5-6h4.003V16H5zM10 0h4.011v16H10zm5 5.014h4.004V16H15zm4.996 6.001H24V16h-4.004z"></path></svg>',
                action: this._showModal
            },
            {
                title: "Show/Hide Grayscale Filter",
                icon: "<i class='bi-shadows' style='font-size:16px'></i>",
                action: this._toggleFilter
            }
        ]
    },
    onAdd: function (map) {
        const { title, icon } = this.options;
        const container = DomUtil.create("div", "leaflet-bar");

        this.getButtons().forEach((btnConfig) => {
            
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
                .on(link, "click", btnConfig.action, this);
        })

        return container;
    },
    _toggleFilter: function () {
        this.options.action('filter')
        return null;
    },
    _changeView: function () {
        this.options.action('marker')
        return null;
    },
    _showModal: function () {
        this.options.action('histogram');
        return null;
    },
});
const _createControl = (props) => new _getControl(props);
export default createControlComponent(_createControl);
