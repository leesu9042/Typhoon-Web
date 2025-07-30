import { GeoJsonDataSource } from "cesium";

/**
 * LineString 타입 GeoJSON을 Cesium 뷰어에 추가하고 카메라 이동까지 처리
 * @param {module:cesium.Viewer} viewer - Cesium Viewer 객체
 * @param {Object} lineGeoJson - LineString 타입의 GeoJSON 객체
 * @returns {Promise<DataSource>} - 추가된 데이터 소스 반환
 */
export async function addLineStringToViewer(viewer, lineGeoJson) {
    try {
        const dataSource = await GeoJsonDataSource.load(lineGeoJson);
        viewer.dataSources.add(dataSource);
        viewer.flyTo(dataSource);
        return dataSource;
    } catch (err) {
        console.error("LineString 로드 실패:", err);
        throw err;
    }
}
