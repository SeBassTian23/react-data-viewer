import L from "leaflet";

// Fix resizing issue in leaflet for rectangles
export const fixRectangle = () => {
  return L.extend(L.GeometryUtil || {}, {
    readableArea: function (area, isMetric, precision) {
  
      // Also defaultPrecision copied from the module closure
      var defaultPrecision = {
        km: 2,
        ha: 2,
        m: 0,
        mi: 2,
        ac: 2,
        yd: 0,
        ft: 0,
        nm: 2
      };
  
      var areaStr,
        units,
        type,
        // ^ Note type variable is added here 
        precision = L.Util.extend({}, defaultPrecision, precision);
  
      if (isMetric) {
        units = ['ha', 'm'];
        type = typeof isMetric;
        if (type === 'string') {
          units = [isMetric];
        } else if (type !== 'boolean') {
          units = isMetric;
        }
  
        if (area >= 1000000 && units.indexOf('km') !== -1) {
          areaStr = L.GeometryUtil.formattedNumber(area * 0.000001, precision['km']) + ' km²';
        } else if (area >= 10000 && units.indexOf('ha') !== -1) {
          areaStr = L.GeometryUtil.formattedNumber(area * 0.0001, precision['ha']) + ' ha';
        } else {
          areaStr = L.GeometryUtil.formattedNumber(area, precision['m']) + ' m²';
        }
      } else {
        area /= 0.836127; // Square yards in 1 meter
  
        if (area >= 3097600) { //3097600 square yards in 1 square mile
          areaStr = L.GeometryUtil.formattedNumber(area / 3097600, precision['mi']) + ' mi²';
        } else if (area >= 4840) { //4840 square yards in 1 acre
          areaStr = L.GeometryUtil.formattedNumber(area / 4840, precision['ac']) + ' acres';
        } else {
          areaStr = L.GeometryUtil.formattedNumber(area, precision['yd']) + ' yd²';
        }
      }
  
      return areaStr;
    }
  });
}


// Fix resizing issue in leaflet for circles
export const fixCircle = () => {
  return L.Edit.CircleMarker.extend({
    _createResizeMarker: function () {
      var t2 = this._shape.getLatLng()
        , e2 = this._getResizeMarkerPoint(t2);
      this._resizeMarkers = [],
        this._resizeMarkers.push(this._createMarker(e2, this.options.resizeIcon));
    },
    _getResizeMarkerPoint: function (t2) {
      var e2 = this._shape._radius * Math.cos(Math.PI / 4)
        , i2 = this._map.project(t2);
      return this._map.unproject([i2.x + e2, i2.y - e2]);
    },
    _resize: function (t2) {
      var e2 = this._moveMarker.getLatLng();
      var radius = L.GeometryUtil.isVersion07x() ? e2.distanceTo(t2) : this._map.distance(e2, t2)
        this._shape.setRadius(radius),
        this._map.editTooltip && this._map._editTooltip.updateContent({
          text: L.drawLocal.edit.handlers.edit.tooltip.subtext + "<br />" + L.drawLocal.edit.handlers.edit.tooltip.text,
          subtext: L.drawLocal.draw.handlers.circle.radius + ": " + L.GeometryUtil.readableDistance(radius, true, this.options.feet, this.options.nautic)
        }),
        this._shape.setRadius(radius),
        this._map.fire(L.Draw.Event.EDITRESIZE, {
          layer: this._shape
        });
    }
  });
}