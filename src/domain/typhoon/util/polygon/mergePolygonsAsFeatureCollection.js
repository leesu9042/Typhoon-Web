import * as turf from "@turf/turf";

/**
 * circle(polygon)과 MultiPolygon을 featureCollection으로 병합하는 함수
 */
export function mergePolygonsAsFeatureCollection(originalFC, generatedPolygon) {


    // 1. originalFC에서 Polygon, MultiPolygon만 필터링
    const polygonFeatures = originalFC.features.filter(
        f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
    );


    const allFeatures = [...polygonFeatures];
    // 2. generatedPolygon이 Polygon 또는 MultiPolygon인지 확인
    const type = generatedPolygon?.geometry?.type;
    if (generatedPolygon?.type === "Feature" && (type === "Polygon" || type === "MultiPolygon")) {
        allFeatures.push(generatedPolygon);
    } else {
        console.warn("⚠️ generatedPolygon이 유효한 Polygon 또는 MultiPolygon Feature가 아닙니다.");
    }

    // 3. 하나의 FeatureCollection으로 반환
    return turf.featureCollection(allFeatures);
}
