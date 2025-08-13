// 공통 파이프라인: RAD15 / RAD25 / RAD 전부 처리
import * as turf from "@turf/turf";
import pkg from "cheap-ruler";
import * as Cesium from "cesium";
import {createCirclePolygons} from "./polygonUtils/circle/createCirclePolygon.js";
import {generateConnectedPolygonV2} from "./polygonUtils/createPolygon/generateConnetdPolygonV2.js";
import {mergePolygonsAsFeatureCollection} from "./polygonUtils/polygon/mergePolygonsAsFeatureCollection.js";
import {renderFinalUnionedPolygon} from "./visualize/renderFinalUnionedPolygon.js";


export async function renderRadPolygons(
    viewer,
    radKey,             // "RAD15" | "RAD25" | "RAD"
    geojson,
    {
        color = Cesium.Color.BLUE.withAlpha(0.5),
        outlineColor = Cesium.Color.fromBytes(81, 113, 208),
        flyTo = false,
    } = {}
) {
    const CheapRuler = pkg.default || pkg;
    const ruler = new CheapRuler(16, "kilometers");

    // 1) 각 포인트 반경 원
    const circleFC = createCirclePolygons(geojson, radKey, ruler);

    // 2) 원들을 잇는 연결 폴리곤
    const connected = generateConnectedPolygonV2(circleFC, radKey, ruler);

    // 3) 합치기 → 외곽 라인
    const finalFC = mergePolygonsAsFeatureCollection(circleFC, connected);
    const unioned = turf.union(finalFC);

    // 4) 화면에 그리기
    return renderFinalUnionedPolygon(viewer, unioned, { color, outlineColor, flyTo });
}
