import { GeoJsonDataSource } from "cesium";
import * as Cesium from "cesium";

export async function renderCirclePolygons(viewer, featureCollection, {
    color = null,
    outlineColor = null,
    flyTo = false,
} = {}) {
    const onlyPolygons = {
        type: "FeatureCollection",
        features: featureCollection.features.filter(
            f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
        ),
    };

    try {
        const dataSource = await GeoJsonDataSource.load(onlyPolygons);
        await viewer.dataSources.add(dataSource);

        // 색상 적용 (조건부)
        if (color || outlineColor) {
            const entities = dataSource.entities.values;
            for (const entity of entities) {
                if (color) entity.polygon.material = color;
                if (outlineColor) {
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                }
            }
        }

        if (flyTo) await viewer.flyTo(dataSource);
    } catch (error) {
        console.error("❌ Circle 폴리곤 로드 실패:", error);
    }
}
