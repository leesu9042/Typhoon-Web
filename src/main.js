// src/main.js

// Cesium static assets 경로 설정 (이 줄이 반드시 import보다 먼저 있어야 함)

import {createViewer} from "./shared/cesium/cesiumInitial";

window.CESIUM_BASE_URL = "/static/cesium/";

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer , GeoJsonDataSource ,JulianDate ,BillboardGraphics , Color} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import {setupDropdown} from "./shared/components/dropdown/setupDropdown.js";
import {processTyphoonGeojson} from "./domain/typhoon/errorRadius/processTyphoonGeojson.js";
import {typhoonListManager} from "./domain/typhoon/service/TyphoonListManager.js";
import {TyphoonIofoManager} from "./domain/typhoon/service/TyphoonInfoManger.js";




// main 함수
async function main(){

    const viewer = await createViewer('cesiumContainer');

    //1. 임의 태풍 데이터 받아와서 시각화 test
    //데이터 geoJSON받아오기
    const response = await fetch('/typhoon_features.geojson');
    if (!response.ok) throw new Error('데이터 로드 실패');
    const geojson = await response.json();

    //태풍 geoJSon데이터 넣으면 ( featureCollection형태 )
    // 'RAD'는 반지름 값이 들어 있는 properties의 key.
    // radius 시각화
    await processTyphoonGeojson(viewer,'RAD', geojson);


//    ---여기서부턴 dropdown만드는 그거---

    // 2-1 year드롭다운 셋업
    //  현재 연도부터 10년 전까지 배열 생성
    const currentYear = new Date().getFullYear();
    const yearItems = Array.from({ length: 10 }, (_, i) => String(currentYear - i));



    // 2-2 drop down 만들고 listner 설정
    setupDropdown({
        wrapperId: "yearDropdownWrapper",
        selectId: "yearSelect",
        items: yearItems,
        onChange: async (selectedYear) => {
            try {
                await typhoonListManager.load(selectedYear);


                const typhoonItems = typhoonListManager.getDropDownItems();  // value, text 형식
                // const typhoonItems = typhoonListManager .getNames();
                // 2. 태풍 드롭다운 생성

                setupDropdown({
                    wrapperId: "typhoonDropdownWrapper",
                    selectId: "typhoonSelect",
                    items: typhoonItems,
                    onChange: async (selectedName) => {
                        const seq = typhoonListManager.getSeqByName(selectedName);
                        const detail = typhoonListManager.getBySeq(seq);
                        console.log("✅ 선택한 태풍:", detail);

                        const year = detail.YY;
                        const typ = detail.SEQ;

                        const infoManager = new TyphoonIofoManager([]);
                        await infoManager.load(year, typ);
                        // 해당년도의 해당 번호의 태풍 전체 데이터를 infoManager에 저장


                        //SEQ 값 들어있는 배열 생성
                        const seqArray = infoManager.getAvailableSeqs()


                        setupDropdown({
                            wrapperId: "sequenceDropdownWrapper",
                            selectId: "sequenceSelect",
                            items: seqArray,
                            onChange: async (selectedSeqStr)  => {
                                const selectedSeq = Number(selectedSeqStr);

                                // const forecast = infoManager.getForecastDataBySeq(selectedSeq);
                                // const observed = infoManager.getObservedDataBySeq(selectedSeq);
                                const typhoonData = infoManager.getCombinedFeatureCollectionBySeq(selectedSeq);

                                await processTyphoonGeojson(viewer,'RAD', typhoonData);

                                console.log(`📊 SEQ ${selectedSeq} 선택됨`);
                                console.log("선택된 seq 관측 예측 데이터:", typhoonData);
                            }
                        });
                    }

                });

            } catch (e) {
                console.error("태풍 목록 로딩 실패:", e);
            }
        }
    });



}

// 함수 실행

main()
