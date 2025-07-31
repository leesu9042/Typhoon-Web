import {GeoJsonDataSource} from "cesium";

export async function renderCirclePolygons(viewer, featureCollection) {

    //circle feature만 필터링
    const onlyPolygons = {
        type: "FeatureCollection",
        features: featureCollection.features.filter(
            f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
        ),
    };


    //필터링 된 polygon 시각화
    try {
        const dataSource = await GeoJsonDataSource.load(onlyPolygons);
        await viewer.dataSources.add(dataSource);
    } catch (error) {
        console.error("❌ Circle 폴리곤 로드 실패:", error);
    }
}
