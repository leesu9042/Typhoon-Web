
// cesium viewer 만들어

import {Viewer, Ion, Terrain, Cartesian3, Math as CesiumMath} from 'cesium';



Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NzFhZGVhMy1iNzM0LTRjM2ItYTg3Mi1jNDgzYjg4NzYzMWQiLCJpZCI6MzE5MTM4LCJpYXQiOjE3NTE4NzI2NTN9.bhy1fr5bGeBwAmNUatOrVJKx-XQByatxQe2g4Fm_l-M";


export async function createViewer(containerId) {
    const viewer = new Viewer(containerId, {
        terrain: Terrain.fromWorldTerrain(),
        timeline: false,
        animation: false,
        infoBox: false,            // ← 엔티티 정보 패널 끄기
        baseLayerPicker: false,
    });

    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(127.5, 36.5, 50000),
        orientation: {
            heading: CesiumMath.toRadians(0.0),
            pitch: CesiumMath.toRadians(-15.0),
        },
    });

    return viewer;
}
