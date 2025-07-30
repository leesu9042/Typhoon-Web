/**
 * 범용 드롭다운 생성 함수
 * @param {Object} options
 * @param {string} options.id - select 요소 ID
 * @param {Array<string|{ value: string, text: string }>} options.items - 항목 목록
 * @param {string} [options.className] - 클래스 이름 (기본: "cesium-button")
 * @returns {HTMLSelectElement}
 */
export function createDropdown({ id, items, className = "cesium-button" }) {

    const select = document.createElement("select");
    select.id = id; //인자로 들어온 id값으로 select를 만든다
    select.className = className; //이건 만들 class이름

    for (const item of items) { //이건 인자로 받는 dropdown에 올릴 데이터 배열

        const option = document.createElement("option");
        //createElement는 태그를 생성해주는 함수다.

        if (typeof item === "object") {
            option.value = item.value;
            option.textContent = item.text;
        } else {
            option.value = item;
            option.textContent = item;
        }

        select.appendChild(option);
    }

    return select;
}
