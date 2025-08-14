// src/main.js

// Cesium static assets 경로 설정 (이 줄이 반드시 import보다 먼저 있어야 함)

import {createViewer} from "./shared/cesium/cesiumInitial.js";

window.CESIUM_BASE_URL = "/static/cesium/";

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer , GeoJsonDataSource ,JulianDate ,BillboardGraphics , Color} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import {setupYearDropdown} from "./domain/typhoon/dropDown/setTyphoonDropdown.js";
import * as Cesium from "cesium";
import {getClickedBillboard} from "./domain/typhoon/infoPopup/utils/getClickedBillboard.js";
import {render} from "lit";
import {createEntityInfoTemplate} from "./domain/typhoon/infoPopup/TyphoonInfoUI/createEntityInfoTemplate.js";
import {updatePosition} from "./domain/typhoon/infoPopup/utils/updatePostion.js";
import {injectLegendHTML} from "./domain/typhoon/infoPopup/legend/injectLegendHTML.js";
import {setupTyphoonEntityLabelHandler} from "./domain/typhoon/infoPopup/setupTyphoonEntityLabelHandler.js";




// main 함수
async function main(){


    //1. 세슘뷰어 생성
    const viewer = await createViewer('cesiumContainer');


    // 2. 드롭다운 생성 + 리스너 설정
    await setupYearDropdown(viewer)



// // 따라다닐 엔티티 (예: 움직이는 위성)
//     const myEntity = viewer.entities.add({
//         name: "움직이는 엔티티",
//         position: Cesium.Cartesian3.fromDegrees(127.0, 37.5),
//         point: { pixelSize: 10, color: Cesium.Color.RED }
//     });
//     htmlLabel.style.display = "block"; // 표시
//
// // 카메라가 렌더될 때마다 엔티티 위치를 추적해서 HTML 위치 갱신
//     viewer.scene.postRender.addEventListener(() => {
//         const position = myEntity.position.getValue(Cesium.JulianDate.now());
//         if (!position) return;
//
//         const screenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, position);
//         if (!screenPosition) return;
//
//         htmlLabel.style.left = `${screenPosition.x}px`;
//         htmlLabel.style.top = `${screenPosition.y - 40}px`; // 말풍선처럼 위로 띄우기
//     });

    //
    // const handler = getClickedBillboard(viewer, function (entity) {
    //     console.log("클릭한 포인트 엔티티:", entity.properties.values);
    // });



    // let activeLabel = null;

    // 3 ui들 띄우기 (태풍 info , 범례 html 판)
    setupTyphoonEntityLabelHandler(viewer);

    // 3. 태풍 ui 띄우기

    // // 함수1
    // //1. 클릭한 billboard entity 객체 가져오기
    // const handler = getClickedBillboard(viewer, function (entity) {
    //     console.log("클릭한 포인트 엔티티:", entity.properties?.values);
    //
    //     injectLegendHTML('legend-container' );
    //
    //
    //     // 기존 라벨 제거
    //     if (activeLabel) {
    //         activeLabel.remove();
    //         activeLabel = null;
    //     }
    //
    //     //함수 2
    //     //  라벨 만들기 (entity property가지고 html 템플릿 만들기)
    //     const template = createEntityInfoTemplate(entity);
    //
    //
    //     // 라벨 표시할 DOM 요소
    //     const container = document.getElementById('entity-label');
    //
    //     // 화면에 렌더링
    //     render(template, container);
    //
    //
    //     //함수 3
    //     //  좌표 따라 움직이도록 postRender 등록
    //     //현재 엔티티의 포지션에 맞게끔 html의 포지션도 바꿔주기
    //
    //     //updatePosition 선택된 엔티티 값의 postion에 따라
    //     // html의 위치도 변경해주는 함수
    //     // 함수를 변수명으로 정의후
    //     const positionUpdater = () => updatePosition(entity, viewer, container);
    //
    //
    //
    //
    //     // 렌더링 될때마다 실행할 함수로 넣기
    //     viewer.scene.postRender.addEventListener(positionUpdater);
    //
    //     //  나중에 제거할 수 있도록 객체 저장
    //     activeLabel = {
    //         remove: () => {
    //             viewer.scene.postRender.removeEventListener(positionUpdater);
    //             render(null, container); // 라벨 지우기
    //         }
    //     };
    // });
    //




}

// 함수 실행

main()



// // 스위치 가져오는
// loadSwitchComponent();
//
//
//
// async function loadSwitchComponent() {
//     const res = await fetch('/src/domain/typhoon/ui/components/switch.html');
//     const html = await res.text();
//     document.getElementById('switchWrapper').innerHTML = html;
// }
