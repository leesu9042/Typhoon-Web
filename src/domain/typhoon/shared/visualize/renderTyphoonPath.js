import {Color, GeoJsonDataSource} from "cesium";

/**
 * LineString 타입 GeoJSON을 Cesium 뷰어에 추가하고 카메라 이동까지 처리
 * @param {module:cesium.Viewer} viewer - Cesium Viewer 객체
 * @param {Object} lineGeoJson - LineString 타입의 GeoJSON 객체
 * @returns {Promise<DataSource>} - 추가된 데이터 소스 반환
 */
export async function renderTyphoonPath(viewer, lineGeoJson) {
    try {
        const dataSource = await GeoJsonDataSource.load(lineGeoJson);
        await viewer.dataSources.add(dataSource);

        // 각 엔티티에 대해 스타일 지정
        dataSource.entities.values.forEach(entity => {
            if (entity.polyline) {
                entity.polyline.material = Color.GREEN;
                entity.polyline.width = 3; // 필요시 너비 조정
            }
        });

    } catch (error) {
        console.error("lineStirng 로드 실패:", error);
    }
}
