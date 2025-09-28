export default function pointIsInPolygon(point, polygon) {
    var x = point.lng,
        y = point.lat;

    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i]['lng'],
            yi = polygon[i]['lat'];
        var xj = polygon[j]['lng'],
            yj = polygon[j]['lat'];
        var intersect =
            (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
