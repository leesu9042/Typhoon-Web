import { lineString } from '@turf/turf';

// 유틸 함수 (GeoJSON 데이터 받아서 LineString 리턴)
export function geojsonPointsToLineString(geojson) {
    const coords = geojson.features.map(f => f.geometry.coordinates);
    return lineString(coords);

}


