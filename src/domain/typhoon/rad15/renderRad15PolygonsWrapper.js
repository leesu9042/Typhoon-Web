import * as Cesium from "cesium";
import {renderRadPolygons} from "../shared/renderRadPolygons.js";

// 기존 시그니처(viewer, RADproperty, geojson) 유지해도 됨. 두 번째 인자는 더 이상 안 씀.
export function renderRad15PolygonsWrapper(viewer, _notUsed, geojson) {
    return  renderRadPolygons(viewer, "RAD15", geojson, {
        color: Cesium.Color.fromBytes(143, 199, 232).withAlpha(0.5), // 하늘색
        outlineColor: Cesium.Color.fromBytes(143, 199, 232),
    });
}
