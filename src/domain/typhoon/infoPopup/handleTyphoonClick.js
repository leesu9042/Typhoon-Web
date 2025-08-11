import {handleTyphoonInfoLabel} from "./TyphoonInfoUI/handleTyphoonInfoLabel.js";
import {handleLegendUI} from "./legend/handleLegendUI.js";
import {clearActiveLabel, getActiveLabel, setActiveLabel} from "./state/LabelState.js";

export function handleTyphoonClick(entity, viewer) {


    const prev = getActiveLabel();
    if (prev) {
        prev.remove();
        clearActiveLabel();
    }

    // entity로 info만들고
    // info가 entity 따라가게끔 설정
    const label = handleTyphoonInfoLabel(entity, viewer);
    setActiveLabel(label);


    // 범례 html load
    handleLegendUI();
}
