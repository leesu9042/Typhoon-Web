
import { render } from "lit";
import { injectLegendHTML } from "./legend/injectLegendHTML.js";
import {getClickedBillboard} from "./utils/getClickedBillboard.js";
import {createEntityInfoTemplate} from "./TyphoonInfoUI/createEntityInfoTemplate.js";
import {updatePosition} from "./utils/updatePostion.js";
import {handleTyphoonClick} from "./handleTyphoonClick.js";



// entity가 클릭되면 엔티티 값 가지고와서 콜백을 실행
export function setupTyphoonEntityLabelHandler(viewer) {
    let activeLabel = null;

    // billboard 클릭 이벤트 등록
    getClickedBillboard(viewer, (entity) => {
        if (!entity?.properties) return;
        handleTyphoonClick(entity, viewer);

        // // 1. 범례 불러오기
        // injectLegendHTML("legend-container");
        //
        // // 2. 이전 라벨 제거
        // if (activeLabel) {
        //     activeLabel.remove();
        //     activeLabel = null;
        // }
        //
        // // 3. 라벨 생성
        // const template = createEntityInfoTemplate(entity);
        // const container = document.getElementById("entity-label");
        // render(template, container);
        //
        //
        //
        // // 4. 위치 업데이트
        // //updatePostion -> entity의 위치에따라 conttainer의 위치도 변경 (3d위치를 -> 2d위치로 변하는 작업도 있다)
        // const positionUpdater = () => updatePosition(entity, viewer, container);
        // viewer.scene.postRender.addEventListener(positionUpdater);
        //
        // activeLabel = {
        //     remove: () => {
        //         viewer.scene.postRender.removeEventListener(positionUpdater);
        //         render(null, container);
        //     },
        // };
    });
}
