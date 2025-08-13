// main.js 내부


// -----------------------

import {injectDropdown} from "../../../shared/components/dropdown/injectDropdown.js";
import {typhoonListManager} from "../shared/service/TyphoonListManager.js";
import {TyphoonInfoManager} from "../shared/service/TyphoonInfoManger.js";
import {processTyphoonGeojson} from "../errorRadius/processTyphoonGeojson.js";
import {clearActiveLabel, getActiveLabel} from "../infoPopup/state/LabelState.js";
import {renderRad15PolygonsWrapper} from "../rad15/renderRad15PolygonsWrapper.js";
import {renderRad25PolygonsWrapper} from "../rad25/renderRad25PolygonsWrapper.js";

export async function setupYearDropdown(viewer) {

    const currentYear = new Date().getFullYear();
    const yearItems = Array.from({ length: 10 }, (_, i) => String(currentYear - i));

    injectDropdown({
        wrapperId: "yearDropdownWrapper",
        selectId: "yearSelect",
        items: yearItems,
        placeholder: "-- 연도를 선택하세요 --",

        //아이템 리스너
        onChange: async (selectedYear) => {
            try {

                await typhoonListManager.load(selectedYear);
                const typhoonItems = typhoonListManager.getDropDownItems();
                setupTyphoonDropdown(viewer, typhoonItems);


            } catch (e) {
                alert(` ${selectedYear}년도 태풍 목록 로드 실패`);
                console.error("태풍 목록 로딩 실패:", e);
            }
        }
    });
}



function setupTyphoonDropdown(viewer, typhoonItems) {

    injectDropdown({

        wrapperId: "typhoonDropdownWrapper",
        selectId: "typhoonSelect",
        items: typhoonItems,
        placeholder: "-- 태풍을 선택하세요 --",


        onChange: async (selectedName) => {

            try {
                const seq = typhoonListManager.getSeqByName(selectedName);
                const detail = typhoonListManager.getBySeq(seq);

                const infoManager = new TyphoonInfoManager([]);
                await infoManager.load(detail.YY, detail.SEQ,selectedName);

                const seqArray = infoManager.getAvailableSeqs();
                setupSequenceDropdown(viewer, infoManager, seqArray);
            }catch (e) {
                alert(` ${selectedName} | 태풍 데이터 로드 실패`);
                console.error("태풍 목록 로딩 실패:", e);
            }


        }
    });
}




function setupSequenceDropdown(viewer, infoManager, seqArray) {
    injectDropdown({
        wrapperId: "sequenceDropdownWrapper",
        selectId: "sequenceSelect",
        items: seqArray,
        placeholder: "-- 시퀀스(발표번호)를 선택하세요 --",
        onChange: async (selectedSeqStr) => {

            //시퀀스 선택시 info UI 닫기
            const prev = getActiveLabel();
            if (prev) {
                prev.remove();
                clearActiveLabel();
            }



            const selectedSeq = Number(selectedSeqStr);
            const typhoonData = infoManager.getCombinedFeatureCollectionBySeq(selectedSeq);

            await processTyphoonGeojson(viewer, "RAD", typhoonData);


            //wrpper함수로 바꿔봤당
            await renderRad15PolygonsWrapper(viewer, "RAD15", typhoonData);
            await renderRad25PolygonsWrapper(viewer, "RAD25", typhoonData);



            //드롭다운에있는 메타데이터로 데이터받아서
            // 폴리곤 시각화



            console.log(`✅ SEQ ${selectedSeq} 선택됨`);
            console.log("선택된 데이터:", typhoonData);
        }
    });
}
