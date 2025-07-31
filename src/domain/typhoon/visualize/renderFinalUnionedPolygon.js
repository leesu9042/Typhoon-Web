// src/domain/typhoon/visualize/renderFinalUnionedPolygon.js



// 8. 최종 union된 데이터 시각화

import { GeoJsonDataSource } from "cesium";

export async function renderFinalUnionedPolygon(viewer, geojson) {
    try {
        const dataSource = await GeoJsonDataSource.load(geojson);
        await viewer.dataSources.add(dataSource);
    } catch (error) {
        console.error("❌ 최종 union 폴리곤 로드 실패:", error);
    }
}
