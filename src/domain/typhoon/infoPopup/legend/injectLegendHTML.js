// setupTyphoonEntityLabelHandler함수에서 billbaord(태풍의 point) 선택되면 범례데이터 불러와지게 그렇게 설정되어있음


import {clearActiveLabel} from "../state/LabelState.js";

let isInjected = false;


export async function injectLegendHTML(containerId, path = '/legend/legend.html') {
    if (isInjected) return;

    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`[legend] container not found: ${containerId}`);
        return;
    }

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load legend from ${path}`);

        const html = await res.text();
        container.innerHTML = html;
        isInjected = true; // ✅ 한 번만 로드하게 됨

        // 닫기 버튼 동작 추가
        const closeBtn = container.querySelector('.legend-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                container.innerHTML = "";
                isInjected = false; // 다시 열 수 있게
            });
        }





    } catch (err) {
        console.error('[legend] Failed to load:', err);
    }
}
