import * as turf from "@turf/turf";

/**
 * circle(polygon)과 MultiPolygon을 featureCollection으로 병합하는 함수
 */
export function mergePolygonsAsFeatureCollection(originalFC, generatedPolygon) {
    if (!originalFC || !originalFC.features) {
        console.warn("⚠️ originalFC가 유효하지 않습니다.");
        return turf.featureCollection([]);
    }

    // 1. originalFC에서 Polygon, MultiPolygon만 필터링
    const polygonFeatures = originalFC.features.filter(
        f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
    );

    const allFeatures = [...polygonFeatures];

    // 2. generatedPolygon이 유효한 Feature인지 확인 후 추가
    if (
        generatedPolygon &&
        generatedPolygon.type === "Feature" &&
        (generatedPolygon.geometry?.type === "Polygon" || generatedPolygon.geometry?.type === "MultiPolygon")
    ) {
        allFeatures.push(generatedPolygon);
    } else {
        console.warn("⚠️ generatedPolygon이 유효한 Polygon 또는 MultiPolygon Feature가 아닙니다. 병합에서 제외됨.");
    }

    // 3. 하나의 FeatureCollection으로 반환
    return turf.featureCollection(allFeatures);
}
