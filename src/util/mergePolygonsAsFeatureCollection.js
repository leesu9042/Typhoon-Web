import * as turf from "@turf/turf";

/**
 * circle(Polygon)과 MultiPolygon을 featureCollection으로 병합하는 함수
 */
export function mergePolygonsAsFeatureCollection(originalFC, generatedMultiPolygon) {
    // 1. Polygon, MultiPolygon만 필터링
    const polygonFeatures = originalFC.features.filter(
        f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
    );

    // 2. generatedMultiPolygon이 Feature<MultiPolygon>인지 확인
    const allFeatures = [...polygonFeatures];

    if (generatedMultiPolygon?.type === "Feature" && generatedMultiPolygon.geometry?.type === "Polygon") {
        allFeatures.push(generatedMultiPolygon);
    } else {
        console.warn("⚠️ generatedMultiPolygon이 유효한 MultiPolygon Feature가 아닙니다.");
    }

    // 3. 하나의 FeatureCollection으로 반환
    return turf.featureCollection(allFeatures);
}
