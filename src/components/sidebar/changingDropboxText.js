
//대충 이해감

//드롭다운 고르면 고른 text로 버튼글자가 바뀌게 (현재 선택한 text 알 수 있게)

// onselect -> 콜백함수임 값이 선택되면 실행

export function changingDropboxText(onSelect) {
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedYear = this.getAttribute('data-value');
            document.getElementById('yearDropdown').textContent = selectedYear + '년';
            console.log('내가 선택한 연도:', selectedYear);

            if (typeof onSelect === 'function') {
                onSelect(selectedYear);  // 선택된 연도를 콜백으로 전달
            }
        });
    });
}
