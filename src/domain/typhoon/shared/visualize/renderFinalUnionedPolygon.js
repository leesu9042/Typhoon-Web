// src/domain/typhoon/visualize/renderFinalUnionedPolygon.js



// 8. 최종 union된 데이터 시각화

import { GeoJsonDataSource } from "cesium";
import * as Cesium from "cesium";

/**
 * 최종 union된 폴리곤을 Cesium에 시각화합니다.
 *
 * @param {Cesium.Viewer} viewer - Cesium 뷰어 객체
 * @param {Object} geojson - Polygon 또는 MultiPolygon 형태의 GeoJSON 객체
 * @param {Object} [options]
 * @param {Cesium.Color} [options.color] - 내부 색상 (material)
 * @param {Cesium.Color} [options.outlineColor] - 외곽선 색상
 * @param {boolean} [options.flyTo] - 카메라 이동 여부
 */
export async function renderFinalUnionedPolygon(viewer, geojson, {
    color = null,
    outlineColor = null,
    flyTo = false,
    clampToGround = true // 폴리곤을 지면에 붙임

} = {}) {
    try {

        const dataSource = await GeoJsonDataSource.load(geojson, {
            clampToGround: clampToGround  // <- options 인자로 반영
        });

        await viewer.dataSources.add(dataSource);

        const entities = dataSource.entities.values;

        if (color || outlineColor) {
            for (const entity of entities) {
                if (entity.polygon) {
                    if (color) entity.polygon.material = color;
                    if (outlineColor) {
                        entity.polygon.outline = true;
                        entity.polygon.outlineColor = outlineColor;

                    }
                }
            }
        }

        if (flyTo) {
            await viewer.flyTo(dataSource);
        }
    } catch (error) {
        console.error("❌ 최종 union 폴리곤 로드 실패:", error);
    }
}
