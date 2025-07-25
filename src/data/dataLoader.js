

export async function fetchGeoJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('데이터 로드 실패');
    return response.json();
}
