//typ(태풍고유번호) , seq(발표번호)를 이용해 데이터를 가져오고
//해당 typ의 seq가 몇개인지  ,1번기능
// seq값으로 해당 발표번호에 발표했던 정보(관측 + 예측)를 알려주는 ,2번기능


import {TyphoonListManager} from "./TyphoonListManager.js";

export class TyphoonIofoManager {



    constructor(data) {
        this.list = [];
        this.year = null;
        this.typ = null;
    }

    async load(year,typ) {

        if (this.year === year && this.typ === typ && this.list.length > 0) return;

        // 예: /public/typhoonList/typhoons_2024_7.json
        const url = `/typhoonRoute/typhoon_${year}_${typ}.geojson`;
        const res = await fetch(url);  // fetch로 파일 가져오기

        if (!res.ok) throw new Error("파일 없음!"); // 실패 시 에러 발생

        this.list = await res.json(); // 성공 후에만 저장
        this.year = year;
        this.typ = typ; //
        //featureCollection 타입
    }


// ???
    getAvailableSeqs() {
        const seqs = this.list.features.map(f => f.properties.SEQ);

        //배열 seqs에서 중복 제거하고, 오름차순으로 정렬해서 새로운 배열 만들기
        const uniqueSortedSeqs = [...new Set(seqs)]//.sort((a, b) => a - b); sort한건데 이미 데이터가sort되서옴
        return uniqueSortedSeqs;

    }


    getFeatureCollectionBySeq(seq) {
        const features =  this.list.features.filter(f => f.properties.SEQ === seq);
        return {
            type: "FeatureCollection",
            features: features
        };

    }

    getCombinedFeatureCollectionBySeq(seq) {
        // 1. 관측: SEQ <= 선택된 SEQ, FT === 0
        const observed = this.list.features.filter(
            f => f.properties.FT === 0 && f.properties.SEQ <= seq
        );

        // 2. 예측: SEQ === 선택된 SEQ, FT === 1
        const forecast = this.list.features.filter(
            f => f.properties.FT === 1 && f.properties.SEQ === seq
        );

        // 3. 합쳐서 FeatureCollection으로 반환
        return {
            type: "FeatureCollection",
            features: [...observed, ...forecast],
        };
    }
}
export const typhoonIofoManager = new TyphoonIofoManager();
