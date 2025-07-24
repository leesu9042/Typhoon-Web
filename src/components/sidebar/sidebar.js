

export function setupYearDropdown() {
    // 1. 드롭다운 메뉴 항목 모두 선택
    document.querySelectorAll('.dropdown-item').forEach(item => {
        // 2. 클릭할 때마다 아래 코드 실행
        item.addEventListener('click', function(e) {
            e.preventDefault(); // 클릭시 화면이 이동하는 걸 막음
            const selectedYear = this.getAttribute('data-value'); // 2022, 2023, 2024
            // 3. 버튼 텍스트를 내가 선택한 연도로 바꿔줌
            document.getElementById('yearDropdown').textContent = selectedYear + '년';
            // (원하면 여기서 selectedYear를 전역변수에 저장하거나, 콘솔에 출력 가능)
            console.log('내가 선택한 연도:', selectedYear);
        });
    });
}