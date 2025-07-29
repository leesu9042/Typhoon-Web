import { lineString } from '@turf/turf';


/**
 * @function geojsonPointsToLineString
 *
 * @description GeoJSON Point Feature들을 받아서 LineString Feature로 변환합니다.
 * @param {GeoJSON.FeatureCollection} geojson - Point 타입의 Feature들을 포함한 GeoJSON FeatureCollection
 * @returns {GeoJSON.Feature<LineString>} LineString 타입의 Turf.js GeoJSON Feature 객체
 */

// 유틸 함수 (GeoJSON 데이터 받아서 LineString 리턴)
export function geojsonPointsToLineString(geojson) {
    const coords = geojson.features.map(f => f.geometry.coordinates);
    return lineString(coords);

}


