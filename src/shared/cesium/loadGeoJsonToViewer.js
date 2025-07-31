import { GeoJsonDataSource } from "cesium";


//일단 하드코딩으로 각각 별로없으니까
/**
 * GeoJSON 데이터를 Cesium Viewer에 로드하고 옵션에 따라 스타일링 및 flyTo 수행
 *
 * @param {Cesium.Viewer} viewer - Cesium Viewer 인스턴스
 * @param {Object} geojson - GeoJSON 형식의 데이터
 * @param {Object} [options]
 * @param {boolean} [options.flyTo=true] - 카메라 이동 여부
 * @param {Function} [options.onEntity] - 각 Entity에 대한 후처리 콜백 (예: 아이콘, 색상 등)
 * @param {Object} [options.loadOptions] - GeoJsonDataSource.load에 넘길 옵션 (markerSize 등)
 * @returns {Promise<GeoJsonDataSource>} - 로드된 데이터소스 반환
 */
export async function loadGeoJsonToViewer(viewer, geojson, {
    flyTo = false,
    onEntity = null,
    loadOptions = {},
} = {}) {


    try {
        const dataSource = await GeoJsonDataSource.load(geojson, loadOptions);
        await viewer.dataSources.add(dataSource);

        const entities = dataSource.entities.values;
        if (onEntity && typeof onEntity === "function") {
            for (const entity of entities) {
                onEntity(entity);
            }
        }

        if (flyTo) {
            await viewer.flyTo(dataSource);
        }

        return dataSource;
    } catch (error) {
        console.error("❌ GeoJSON 로드 실패:", error);
        throw error;
    }
}
