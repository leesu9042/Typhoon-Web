/*
 * 태풍 시각화 유틸리티 함수 모음
 * - createPolygons: 태풍 데이터를 받아 지오메트리(원형 + 연결 폴리곤)를 생성
 * - processPolygons: 인접한 폴리곤을 합쳐서 하나의 피처로 반환
 * - addTyphoonCircleLayers: Mapbox에 태풍 반경 레이어를 추가
 * - 설정 객체: 반경, 스타일 등
 */
import * as turf from "@turf/turf";

/**
 * 데이터의 각 지점에 대해 반경(원형)과 이전 지점과의 연결 폴리곤을 생성합니다.
 * @param {Object} data - GeoJSON 형식의 태풍 관측/예측 데이터
 * @param {string} property - 반경으로 사용할 속성 이름 (예: 'RAD15')
 * @param {Object} ruler - turf.js 의 거리/방위 계산 유틸
 * @returns {Array} featureCollection 배열
 */

export function createPolygons(data, property, ruler) {
    // reduce를 사용해 이전 지점 정보와 결과 컬렉션을 함께 관리
    const collections = data.features.reduce( //1번질문 objcet는 그냥api로 받아온 data가아니라 별도의 objcet로 파싱한거인지?
        (acc,item) => {
            // 원본 데이터에서 경도/위도를 문자열로 받아 숫자로 변환
            const coordinates = item.geometry.coordinates;
            const lon = parseFloat(coordinates[0]);
            const lat = parseFloat(coordinates[1]);

            // 유효한 좌표인지 확인: 숫자가 아니면 해당 지점 무시
            if (isNaN(lon) || isNaN(lat)) {
                console.error("Invalid coordinates:", coordinates);
                return acc;
            }

            //turf.js에서 경도 위도로 묶어서 이런식으로 사용
            const currentPoint = [lon, lat];



            // 속성(property) : 반경으로 사용할 속성이름 값을 숫자로 변환, 유효하지 않으면 0 사용
            const propertyValue = parseFloat(item.properties[property]) || 0;



            // 반경 값이 0 이하거나 NaN 이면 무시
            if (propertyValue <= 0 || isNaN(propertyValue)) {
                console.warn(`${property} 값이 유효하지 않습니다: ${item.properties[property]}`);
                return acc;
            }


            // 아이템에 반경 값을 저장해두면 다음 단계에서 사용 가능
            item.propertyValue = propertyValue;

            // 현재 지점에 대한 원(circle) GeoJSON 생성 (단위: 킬로미터)
            const circle = turf.circle(currentPoint, propertyValue, {
                steps: 64,      // 원을 다각형 approximation 할 때 점 개수
                units: "kilometers",
            });

            let polygons = circle;

            // 이전 지점이 있다면, 두 지점을 연결하는 사각형 폴리곤 생성
            if (acc.previousPoint) {
                const prevCoords = acc.previousPoint.geometry.coordinates;

                // 이전 지점과 현재 지점 사이의 방위각 계산
                let bearing = ruler.bearing(prevCoords, currentPoint);

                // 방위각 기준으로 반경 값을 사용해 사각형 꼭짓점 계산
                let p1 = ruler.destination(currentPoint, propertyValue, bearing + 90);
                let p2 = ruler.destination(prevCoords, acc.previousPoint.propertyValue, bearing + 90);
                let p3 = ruler.destination(prevCoords, acc.previousPoint.propertyValue, bearing - 90);
                let p4 = ruler.destination(currentPoint, propertyValue, bearing - 90);

                // 사각형 폴리곤 생성하고, circle과 함께 컬렉션화
                const connector = turf.polygon([[p1, p2, p3, p4, p1]]);
                polygons = turf.featureCollection([circle, connector]);
            }

            // 현재 아이템을 "이전 지점"으로 저장 후, 결과 배열에 추가
            acc.previousPoint = item;
            acc.collection.push(polygons);

            return acc;
        },
        { previousPoint: null, collection: [] }  // 초기값: 이전 지점 없음, 결과 빈배열
);

    // reduce 완료 후, 생성된 폴리곤 컬렉션 배열 반환
    return collections.collection;
}

/**
 * 생성된 폴리곤을 인접 쌍으로 결합(union)하여 깔끔한 형태로 만듭니다.
 * @param {Array} polygons - createPolygons로 생성된 폴리곤 배열
 * @returns {Array} 결합된 폴리곤 피처 배열
 */
export function processPolygons(polygons) {
    const result = [];

    for (let i = 0; i < polygons.length; i++) {
        if (i === 0) {
            // 첫 번째는 그대로 추가
            result.push(polygons[i]);
            continue;
        }
        // 인접한 두 폴리곤을 union 연산으로 합침
        const combined = turf.union(polygons[i], polygons[i - 1]);
        result.push(combined);
    }

    return result;
}
/**
 * Mapbox 지도에 태풍 반경(원 + 연결 폴리곤) 레이어를 추가하는 함수
 * @param {Object} data - 태풍 관측/예측 데이터
 * @param {Object} ruler - turf.js 거리/방위 계산 유틸
 * @param {string|number} typhoonIdentifier - 태풍 식별자 (예: 호수)
 */
async function addTyphoonCircleLayers(data, ruler, typhoonIdentifier) {
    // 각 설정 항목마다 레이어 생성
    for (const config of TYPHOON_CIRCLE_CONFIGS) {
        // 1) 속성값 기반 폴리곤 생성
        const rawPolygons = createPolygons(data, config.property, ruler);
        // 2) 인접 폴리곤 결합
        const processed = processPolygons(rawPolygons);
        // 3) 추가 스무딩 처리 (별도 구현 필요)
        const smoothed = createSmoothedData(processed);

        if (!smoothed) {
            console.warn(`${config.property} 레이어를 건너뜁니다: 유효한 데이터가 없습니다.`);
            continue;
        }

        // GeoJSON 소스 ID 정의
        const sourceId = `typhoon${config.property}Circles${typhoonIdentifier}`;
        // 지도에 GeoJSON 소스 추가
        addGeoJSONSource(sourceId, smoothed);

        // 채우기(fill) 레이어 추가
        addMapLayer(`${sourceId}Layer`, "fill", sourceId, {
            "fill-color": config.fillColor,
            "fill-opacity": 0.3,
        });

        // 윤곽선(line) 레이어 추가
        addMapLayer(`${sourceId}Outline`, "line", sourceId, {
            "line-color": config.lineColor,
            "line-width": 2,
        });
    }
}

// 태풍 반경 레이어 설정: 속성(property), 선 색상, 채우기 색상
export const TYPHOON_CIRCLE_CONFIGS = [
    {
        property: "RAD15",       // 반경 속성 이름
        lineColor: "#2810fe",    // 윤곽선 색상
        fillColor: "#b2b6fe",    // 채우기 색상
    },
    {
        property: "errorRadius",
        lineColor: "#2945A3",
        fillColor: "#0080FF",
    },
];

// 태풍 중심점 스타일
export const TYPHOON_CENTER_STYLE = {
    color: "#FF0000",
    radius: 5,
    strokeWidth: 1,
    strokeColor: "#FFFFFF",
};

// 태풍 경로 스타일
export const TYPHOON_PATH_STYLE = {
    color: "#FF0000",
    width: 2,
    dashArray: [2, 0.5],  // 점선 패턴
};

// 태풍 텍스트(시간) 스타일
export const TYPHOON_TEXT_STYLE = {
    color: "#FF0000",
    fontSize: 12,
    fontWeight: "bold",
    offset: [0, -5],      // 텍스트 위치 오프셋 (x, y
    anchor: "left",      // 텍스트 anchor
    textField: "forecastTime",  // 사용할 데이터 필드
};



// 데이터 구조 예시 gpt로 추측함
/*
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [<lon>, <lat>]
            },
            "properties": {
                "time": "<ISO8601 시각>",
                "forecastTime": "<한글 예측 시각>",
                "wind_speed": "<풍속>",
                "pressure": "<기압>",
                "direction": "<진행 방향>"
                // ... 그 외 필요한 속성들
            },
            "propertyValue": <숫자 반경값>
        }
        // ... 총 8개의 Feature 등
    ]
}
*/

// ==============================
// 위 함수들과 설정들을 이용해 태풍 반경 시각화 및 지도 스타일 적용이 가능합니다.
// 실제 사용 시, 각 함수에 맞는 데이터와 설정값을 전달해주면 됩니다.
// ==============================

// // 데이터 구조 예시
// {
//     "type": "FeatureCollection",
//     "features": [
//     {
//         "type": "Feature",
//         "geometry": {
//             "type": "Point",
//             "coordinates": [<lon>, <lat>]
//                 },
//                 "properties": {
//                     "time": "<ISO8601 시각>",
//                     "forecastTime": "<한글 예측 시각>",
//                     "wind_speed": "<풍속>",
//                     "pressure": "<기압>",
//                     "direction": "<진행 방향>",
//                     // … 그 외 필요한 속성들
//                 },
//                 "propertyValue": <숫자 반경값>
//                     },
//                     // 총 8개의 Feature
//                 ]