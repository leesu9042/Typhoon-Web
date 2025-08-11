import * as Cesium from "cesium";




// 클릭된 빌보드 엔티티 가져오기 ㅇ.ㅇ

export function getClickedBillboard(viewer, onPickPointEntity) {

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function (event) {
        const pickedObject = viewer.scene.pick(event.position);

        if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;

            if (Cesium.defined(entity.billboard)) {
                onPickPointEntity(entity); // 콜백에 엔티티 전달
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return handler; // 필요 시 destroy 가능하게
}