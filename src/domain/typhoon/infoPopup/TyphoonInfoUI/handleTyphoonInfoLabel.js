import {createEntityInfoTemplate} from "./createEntityInfoTemplate.js";
import {render} from "lit";
import {updatePosition} from "../utils/updatePostion.js";



/**
 * entity로 태풍 데이터가 있는 html(info UI)를 만들고 
 * postrender에 렌더링 될 때마다 entity 위차값으로 html(info UI)를 옮기기
 * */
export function handleTyphoonInfoLabel(entity, viewer) {
    const container = document.getElementById("entity-label");

    // 1. 엔티티 정보를 기반으로 html을 만듦
    const template = createEntityInfoTemplate(entity);

    // 2. 그걸 DOM에 렌더링
    render(template, container);

    // 3. 카메라가 움직일 때마다 html 위치를 업데이트
    const updater = () => updatePosition(entity, viewer, container);
    viewer.scene.postRender.addEventListener(updater);

    // 4. 나중에 제거할 수 있게 함수를 반환
    return {
        remove: () => {
            viewer.scene.postRender.removeEventListener(updater);
            render(null, container); // info 창 제거
        },
    };
}
