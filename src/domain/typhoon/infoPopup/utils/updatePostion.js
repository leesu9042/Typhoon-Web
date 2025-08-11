import * as Cesium from "cesium";

export function updatePosition(entity,viewer,container) {
    const position = entity.position?.getValue(Cesium.JulianDate.now());
    if (!position) return;

    const screenPos = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, position);
    if (!screenPos) return;

    container.style.left = `${screenPos.x}px`;
    container.style.top = `${screenPos.y - 250}px`;
}