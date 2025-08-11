import {BillboardGraphics, GeoJsonDataSource, HeightReference, JulianDate, VerticalOrigin} from "cesium";


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

            // 태풍 강도랑 똑같은 이름의 png가져오기
            entities.forEach(function (entity, idx) {
                const TYP_CLASS = entity.properties.TYP_CLASS?.getValue() ?? 'default';
                const FT = entity.properties.FT?.getValue();


                // 기본 아이콘 이름: /static/img/Strong.png 등
                let icon = `/static/img/typhoon_${TYP_CLASS}.png`;



                entity.billboard = new BillboardGraphics({
                    image: icon,
                    width: 48,
                    height: 48,
                    verticalOrigin: VerticalOrigin.BOTTOM, // ⬅️ 아래쪽이 기준점
                    heightReference: HeightReference.CLAMP_TO_GROUND, // ⬅️ 지면에 붙이기
                    disableDepthTestDistance: Number.POSITIVE_INFINITY // ⬅️ 지형에 가려지지 않게 (선택)

                });

                entity.point = undefined; // 원 숨김
            });


            viewer.flyTo(dataSource);
        })
        .catch(function (error) {
            console.error('GeoJSON 로드 실패:', error);
        });

}