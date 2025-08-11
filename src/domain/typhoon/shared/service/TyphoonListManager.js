// 📦 TyphoonManager 클래스
// 태풍 데이터를 불러오고, 이름/SEQ로 조회하는 기능을 제공
/**
 * 현재는 /public/typhoonList 있는 데이터 일단 가져옴
 */


export class TyphoonListManager {
    // ✅ 생성자: 처음엔 빈 리스트를 가지고 시작
    constructor() {
        this.list = [];  // 태풍 목록을 저장할 배열
    }

    // ✅ 비동기 메서드: 특정 연도의 태풍 목록을 불러와 this.list에 저장
    async load(year) {
        // 예: /public/typhoonList/typhoons_2024.json
        const url = `/mockData/typhoonList/typhoons_${year}.json`;
        const res = await fetch(url);  // fetch로 파일 가져오기

        if (!res.ok) throw new Error("파일 없음!"); // 실패 시 에러 발생

        this.list = await res.json(); // 성공하면 JSON 파싱해서 list에 저장
    }

    // ✅ 태풍 이름 목록만 추출해서 배열로 반환 (드롭다운 등에 사용 가능)
    getNames() {
        return this.list.map(t => t.TYP_NAME);
    }

    // ✅ 이름으로 찾아 해당 태풍의 SEQ(태풍번호) 값 반환
    // 예: '카눈' → 3
    getSeqByName(name) {
        return this.list.find(t => t.TYP_NAME === name)?.SEQ ?? null;
        // ?.: 값이 없으면 undefined 반환
        // ?? null: undefined일 경우 null로 대체
    }


    getDropDownItems() {
        return this.list.map(t => ({
            value: t.TYP_NAME, // 선택 시 태풍 이름 전달
            text: `${t.SEQ}호 태풍 | ${t.TYP_NAME}` // 드롭다운에 보여질 텍스트
        }));
    }

    // ✅ SEQ 번호로 해당 태풍 정보 전체 반환
    // 예: 3 → {YY: 2024, SEQ: 3, typ_Name: ..., ...}
    getBySeq(seq) {
        return this.list.find(t => t.SEQ === seq);
    }
}

export const typhoonListManager = new TyphoonListManager();
