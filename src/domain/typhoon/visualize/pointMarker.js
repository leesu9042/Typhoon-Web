import {BillboardGraphics, GeoJsonDataSource, JulianDate} from "cesium";


// geoJson에서 type이 point 형태의 데이터를 지도에 찍어줌

export async function PointMarker(viewer, geojson, iconUrl) {

// viewer는 Cesium.Viewer 객체라고 가정
    GeoJsonDataSource.load(geojson)
        .then(function (dataSource) {
            viewer.dataSources.add(dataSource);

            // 엔티티 개수 확인
            const entities = dataSource.entities.values;
            console.log('엔티티 개수:', entities.length);

            // 첫 번째 엔티티의 속성값 출력(예시)
            if (entities.length > 0) {
                console.log('첫 번째 엔티티 속성:', entities[0].properties);
            }

            // 전체 좌표, LOC 속성만 쭉 출력(예시)
            entities.forEach(function (entity, idx) {
                const pos = entity.position.getValue(JulianDate.now());
                const loc = entity.properties.LOC ? entity.properties.LOC.getValue() : '';
                console.log(idx, pos, loc);

                // 👇 이 부분이 커스텀 billboard(아이콘)으로 바꿔주는 코드!
                entity.billboard = new BillboardGraphics({
                    image: iconUrl, // public 폴더에 저장한 아이콘 경로
                    width: 48,
                    height: 48,
                    // 필요시 scale, rotation, color 등 추가 가능

                });
                entity.point = undefined; // 기본 원(점)은 숨김
            });

            viewer.flyTo(dataSource);
        })
        .catch(function (error) {
            console.error('GeoJSON 로드 실패:', error);
        });

}