// src/main.js



// Cesium static assets 경로 설정 (이 줄이 반드시 import보다 먼저 있어야 함)

import {createViewer} from "./shared/cesium/cesiumInitial.js";
window.CESIUM_BASE_URL = "/static/cesium/";
import "cesium/Build/Cesium/Widgets/widgets.css";
import {setupYearDropdown} from "./domain/typhoon/dropDown/setTyphoonDropdown.js";
import {setupTyphoonEntityLabelHandler} from "./domain/typhoon/infoPopup/setupTyphoonEntityLabelHandler.js";




// main 함수
async function main(){

    //1. 세슘뷰어 생성
    const viewer = await createViewer('cesiumContainer');

    // 2. 드롭다운 생성 + 리스너 설정
    await setupYearDropdown(viewer)

    // 3 ui들 띄우기 (태풍 info , 범례 html 판)
    setupTyphoonEntityLabelHandler(viewer);

}

// 함수 실행

main()



