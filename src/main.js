// src/main.js

// Cesium static assets 경로 설정 (이 줄이 반드시 import보다 먼저 있어야 함)

window.CESIUM_BASE_URL = "/static/cesium/";

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer , GeoJsonDataSource ,JulianDate ,BillboardGraphics , Color} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { geojsonPointsToLineString } from "./util/createPolylines";
import polygonClipping from "polygon-clipping";
import { loadSidebar } from './components/sidebar/sidebarLoader.js';

import * as turf from "@turf/turf";

import pkg from 'cheap-ruler';

import { createPolygons, processPolygons } from "./util/typhoon-utils";


// Cesium ion 토큰 설정
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NzFhZGVhMy1iNzM0LTRjM2ItYTg3Mi1jNDgzYjg4NzYzMWQiLCJpZCI6MzE5MTM4LCJpYXQiOjE3NTE4NzI2NTN9.bhy1fr5bGeBwAmNUatOrVJKx-XQByatxQe2g4Fm_l-M";

// 전체 로직을 async 함수로 감싸기
async function initCesium() {
    const viewer = new Viewer("cesiumContainer", {
        terrain: Terrain.fromWorldTerrain(),
        timeline: false,
        animation: false,
        baseLayerPicker: false,
    });

    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(127.5, 36.5, 50000),
        orientation: {
            heading: CesiumMath.toRadians(0.0),
            pitch: CesiumMath.toRadians(-15.0),
        },
    });

    // viewer는 Cesium.Viewer 객체라고 가정
    GeoJsonDataSource.load('/typhoon_features.geojson')
        .then(function(dataSource) {
            viewer.dataSources.add(dataSource);

            // 엔티티 개수 확인
            const entities = dataSource.entities.values;
            console.log('엔티티 개수:', entities.length);

            // 첫 번째 엔티티의 속성값 출력(예시)
            if (entities.length > 0) {
                console.log('첫 번째 엔티티 속성:', entities[0].properties);
            }

            // 전체 좌표, LOC 속성만 쭉 출력(예시)
            entities.forEach(function(entity, idx) {
                const pos = entity.position.getValue(JulianDate.now());
                const loc = entity.properties.LOC ? entity.properties.LOC.getValue() : '';
                console.log(idx, pos, loc);

                // 👇 이 부분이 커스텀 billboard(아이콘)으로 바꿔주는 코드!
                entity.billboard = new BillboardGraphics({
                    image: '/static/img/typhoon_invert.png', // public 폴더에 저장한 아이콘 경로
                    width: 48,
                    height: 48,
                    // 필요시 scale, rotation, color 등 추가 가능

                });
                entity.point = undefined; // 기본 원(점)은 숨김


            });

            viewer.flyTo(dataSource);
        })
        .catch(function(error) {
            console.error('GeoJSON 로드 실패:', error);
        });



    const response = await fetch('/typhoon_features.geojson');
    const geojson = await response.json();

    const line = geojsonPointsToLineString(geojson); //point geojson -> lineString geojson 변형 유틸
    console.log(JSON.stringify(line, null, 2))


    GeoJsonDataSource.load(line) // line: LineString 타입의 GeoJSON Feature 객체
        .then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            viewer.flyTo(dataSource); // 자동으로 줌 인

            // (아래는 정보 출력용이라면 생략 가능)
            // const entities = dataSource.entities.values;
            // console.log('엔티티 개수:', entities.length);






        })
        .catch(function(err) {
            console.error("LineString 로드 실패:", err);
        });



    const CheapRuler = pkg.default || pkg;

// 그 뒤 사용은 동일
    const ruler = new CheapRuler(37.5, 'kilometers');


// 예시: 'radius' 속성으로 폴리곤 만들기
    const polygonsArr = createPolygons(geojson, 'RAD', ruler);



// step2: 모든 폴리곤들의 coordinates만 추출
    const allPolygons = polygonsArr.flatMap(f => {
        if (f.type === 'Feature' && f.geometry.type.includes('Polygon')) {
            return [f.geometry.coordinates];
        }
        if (f.type === 'FeatureCollection') {
            return f.features.filter(g => g.geometry.type.includes('Polygon')).map(g => g.geometry.coordinates);
        }
        return [];
    });

// step3: polygon-clipping union으로 겹침 없는 폴리곤 합치기
    const unionCoords = polygonClipping.union(...allPolygons);

// step4: GeoJSON 래핑
    const mergedGeoJson = {
        type: 'Feature',
        geometry: {
            type: unionCoords.length === 1 ? 'Polygon' : 'MultiPolygon',
            coordinates: unionCoords.length === 1 ? unionCoords[0] : unionCoords
        },
        properties: {}
    };
    GeoJsonDataSource.load(mergedGeoJson)
        .then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            viewer.flyTo(dataSource); // 자동 줌-인
        })
        .catch(function(err) {
            console.error("Merged Polygon 로드 실패:", err);
        });


}

// 함수 실행
initCesium();


loadSidebar();