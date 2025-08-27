import {handleTyphoonInfoLabel} from "./TyphoonInfoUI/handleTyphoonInfoLabel.js";
import {handleLegendUI} from "./legend/handleLegendUI.js";
import {clearActiveLabel, getActiveLabel, setActiveLabel} from "./state/LabelState.js";


/**
 * 태풍 엔티티를 클릭했을 때 호출되는 핸들러 함수.
 *
 * 동작 순서:
 * 1. 이미 활성화된 태풍 정보창(label)이 있으면 제거하고 상태를 초기화한다.
 * 2. 클릭된 태풍 엔티티(entity)로 새로운 정보창을 생성하여,
 *    카메라 이동 시 태풍 위치를 따라가도록 설정한다. = handleTyphoonInfoLabel()
 * 3. 생성한 정보창을 현재 활성 정보창으로 등록한다.
 * 4. 태풍 관련 범례 UI를 로드하여 화면에 표시한다. = handleLegendUI()
 *
 * @param {Entity} entity - 클릭된 태풍 엔티티 객체
 * @param {Cesium.Viewer} viewer - Cesium 뷰어 인스턴스
 */


export function handleTyphoonClick(entity, viewer) {


    const prev = getActiveLabel();
    if (prev) {
        prev.remove();
        clearActiveLabel();
    }

    // 1. entity로 태풍정보 html만들고
    // info가 entity 따라가게끔 설정
    const label = handleTyphoonInfoLabel(entity, viewer);




    setActiveLabel(label);


    // 2.범례 html load
    handleLegendUI();
}
