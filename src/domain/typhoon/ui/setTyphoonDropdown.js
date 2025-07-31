// main.js 내부


// -----------------------

import {injectDropdown} from "../../../shared/components/dropdown/injectDropdown.js";
import {typhoonListManager} from "../service/TyphoonListManager.js";
import {TyphoonIofoManager} from "../service/TyphoonInfoManger.js";
import {processTyphoonGeojson} from "../errorRadius/processTyphoonGeojson.js";

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

                const infoManager = new TyphoonIofoManager([]);
                await infoManager.load(detail.YY, detail.SEQ);

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
            const selectedSeq = Number(selectedSeqStr);
            const typhoonData = infoManager.getCombinedFeatureCollectionBySeq(selectedSeq);

            await processTyphoonGeojson(viewer, "RAD", typhoonData);

            console.log(`✅ SEQ ${selectedSeq} 선택됨`);
            console.log("선택된 데이터:", typhoonData);
        }
    });
}
