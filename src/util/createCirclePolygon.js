import * as turf from "@turf/turf";

// 태풍 폴리곤 생성 1단계 circle 생성
// geoJson에서 featurecollcetion을 가져와서 그안의 property명을 반지름삼아
// circle polygon type의 Geojson반환


export function createCirclePolygons(data, property, ruler) {
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
            const radius = parseFloat(item.properties[property]) || 0


            if (radius > 0 && !isNaN(radius)) {
                //  반경이 유효하면 Polygon(circle) 생성
                const circle = turf.circle(currentPoint, radius, {
                    steps: 64,
                    units: "kilometers",
                    // 기존 properties 유지 + center 추가
                    properties : {
                        ...(item.properties || {}),  // 기존 속성 복사 (없으면 빈 객체)
                        center: currentPoint,              // center 좌표 추가
                    }
                });

                // 원본 properties 유지 (옵션)???


                acc.push(circle);
                console.log("circle.properties before:", circle.properties);

            } else {
                //  반경이 0이거나 유효하지 않으면 Point 그대로 사용
                acc.push(item);
            }



            return acc;

        }, []);  // 초기값: 결과 빈배열

    // reduce 완료 후, 생성된 폴리곤 컬렉션 배열 반환
    return turf.featureCollection(collections);

}
