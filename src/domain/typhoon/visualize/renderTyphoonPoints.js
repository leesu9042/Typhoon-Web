import {BillboardGraphics, GeoJsonDataSource, JulianDate} from "cesium";


// geoJson에서 type이 point 형태의 데이터를 지도에 찍어줌

export async function renderTyphoonPoints(viewer, geojson,maxSeq) {



// viewer는 Cesium.Viewer 객체라고 가정
    GeoJsonDataSource.load(geojson)
        .then(function (dataSource) {
            viewer.dataSources.add(dataSource);

            // 엔티티(point) 개수 확인
            const entities = dataSource.entities.values;
            console.log('엔티티 개수:', entities.length);

            // 첫 번째 엔티티의 속성값 출력(예시)
            if (entities.length > 0) {
                console.log('첫 번째 엔티티 속성:', entities[0].properties);
            }


            /**
             * 위에는 cesium에 있는 GeoJsonDataSource라는 객체에
             * geoJSON을 넣어서
             * */
            // 전체 좌표, LOC 속성만 쭉 출력(예시)
            entities.forEach(function (entity, idx) {
                const pos = entity.position.getValue(JulianDate.now());
                const loc = entity.properties.LOC?.getValue() ?? '';
                const SEQ = entity.properties.SEQ?.getValue();
                const FT = entity.properties.FT?.getValue();

                let icon = '/static/img/default.png';

                if (FT === 0) {
                    icon = '/static/img/typhoon_FT0.png';      // 과거 관측
                } else {
                    icon = '/static/img/typhoon_FT1.png';      // 예측
                }

                entity.billboard = new BillboardGraphics({
                    image: icon,
                    width: 24,
                    height: 24,
                });

                entity.point = undefined; // 원 숨김
            });


            viewer.flyTo(dataSource);
        })
        .catch(function (error) {
            console.error('GeoJSON 로드 실패:', error);
        });

}