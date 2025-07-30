import { createDropdown } from "./createDropdown.js";

/**
 * 드롭다운 셋업 유틸
 * @param {Object} options
 * @param {string} options.wrapperId - div ID
 * @param {string} options.selectId - select ID
 * @param {Array} options.items - 배열 (string 또는 {value, text})
 * @param {function(string)} options.onChange - 선택 시 실행 함수
 */
export function injectDropdown({ wrapperId, selectId, items, onChange , placeholder = false  }) {
    const wrapper = document.getElementById(wrapperId);
    wrapper.innerHTML = "";




    const select = createDropdown({ id: selectId, items ,placeholder });
    select.addEventListener("change", () => onChange(select.value));
    wrapper.appendChild(select);
}
