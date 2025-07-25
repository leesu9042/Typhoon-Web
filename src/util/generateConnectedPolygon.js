import * as turf from "@turf/turf";

/**
 * 주어진 GeoJSON FeatureCollection에서,
 * Polygon (circle)과 Point들을 조건에 따라 연결하여
 * 하나의 Polygon을 생성.
 *
 * - Polygon에서는 0번째와 중간점을 추출
 * - Point는 양 옆에 Polygon이 하나라도 있을 때만 사용
 *
 * @param {{type: string, features: *}} geojson
 * @returns {Feature<Polygon>} 연결된 Polygon turf 객체
 */
export function generateConnectedPolygon(geojson) {
    const coords = [];
    const features = geojson.features;

    for (let i = 0; i < features.length; i++) {
        const current = features[i];
        const prev = features[i - 1];
        const next = features[i + 1];

        if (current.geometry.type === "Polygon") {


            const ring = current.geometry.coordinates[0];
            const p1 = ring[0];
            const p2 = ring[Math.floor(ring.length / 2)];
            coords.push(p1, p2);


        } else if (current.geometry.type === "Point") {
            const hasAdjacentCircle =
                (prev && prev.geometry.type === "Polygon") ||
                (next && next.geometry.type === "Polygon");

            if (hasAdjacentCircle) {
                coords.push(current.geometry.coordinates);
            }
        }
    }

    if (coords.length > 0) {
        coords.push(coords[0]); // 폴리곤 닫기
    }

    return turf.polygon([coords]);
}
