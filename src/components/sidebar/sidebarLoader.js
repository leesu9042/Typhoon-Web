// sidebarLoader.js
import {changingDropboxText} from './changingDropboxText.js'; // 이벤트 바인딩 함수도 별도 파일이면 이렇게 import

export async function loadSidebar() {
    const response = await fetch('/sidebar.html');
    const sidebarHTML = await response.text();

    document.getElementById('sidebarWrap').innerHTML = sidebarHTML;

    changingDropboxText(selectedYear => {
        console.log('선택된 연도:', selectedYear);
        // API 호출 등 작업
    });
}
