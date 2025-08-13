import * as Cesium from "cesium";
import {renderRadPolygons} from "../shared/renderRadPolygons.js";

export function renderRad25PolygonsWrapper(viewer, _notUsed, geojson) {
    return renderRadPolygons(viewer, "RAD25", geojson, {
        color: Cesium.Color.BLUE.withAlpha(0.5),               // 파랑
        outlineColor: Cesium.Color.fromBytes(81, 113, 208),
    });
}
