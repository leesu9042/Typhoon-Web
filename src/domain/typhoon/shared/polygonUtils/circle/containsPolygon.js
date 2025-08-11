export function countPolygons(featureCollection) {
    if (!featureCollection || !Array.isArray(featureCollection.features)) return 0;

    return featureCollection.features.filter(f =>
        f?.geometry?.type === "Polygon" || f?.geometry?.type === "MultiPolygon"
    ).length;
}
