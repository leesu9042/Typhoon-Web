// src/main.js

// Cesium static assets 경로 설정 (이 줄이 반드시 import보다 먼저 있어야 함)

import {createViewer} from "./cesium/cesiumInitial";

window.CESIUM_BASE_URL = "/static/cesium/";

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer , GeoJsonDataSource ,JulianDate ,BillboardGraphics , Color} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { geojsonPointsToLineString } from "./util/createPolylines";
import polygonClipping from "polygon-clipping";
import { loadSidebar } from './components/sidebar/sidebarLoader.js';

import * as turf from "@turf/turf";

import pkg from 'cheap-ruler';

import {createPolygons, processPolygons} from "./util/typhoon-utils";
import {fetchGeoJson} from "./data/dataLoader";
import { PointMarker} from "./cesium/pointMarker";
import {addLineStringToViewer} from "./cesium/addLineStringToViewer";
import {createCirclePolygons} from "./util/createCirclePolygon";
import {generateConnectedPolygon} from "./util/generateConnectedPolygon";
import {mergePolygonsAsFeatureCollection} from "./util/mergePolygonsAsFeatureCollection.js";



// main 함수
async function main(){

    //1. Cesium  viwer 객체 생성
    const viewer = await createViewer('cesiumContainer');


    //2. geoJSON 데이터 fetch
    const response = await fetch('/typhoon_features.geojson');
    if (!response.ok) throw new Error('데이터 로드 실패');
    const geojson = await response.json();

    //3. point maker 찍기
    await PointMarker(viewer, geojson, '/static/img/typhoon_invert.png');


    //4. line tpye geoJSON 데이터 생성
    const lineGeoJson = geojsonPointsToLineString(geojson); //point geojson -> lineString geojson 변형 유틸
    console.log(JSON.stringify(lineGeoJson, null, 2))

    //5. line viewer에 띄우기
    await addLineStringToViewer(viewer, lineGeoJson);



    //cheap - ruler 객체 초기화
    const CheapRuler = pkg.default || pkg;
    const ruler = new CheapRuler(37.5, 'kilometers');


    //  'RAD'속성을 반지름으로하는 ceisium에 올릴 폴리곤 데이터 만들기
    //  geoJSon형태의 featureCollection
    const circleFeatureCollection  = createCirclePolygons(geojson, 'RAD', ruler);
    console.log(JSON.stringify(circleFeatureCollection, null, 2))



    // circleFeatureCollection 값 양호한지 test
    // const result = createCirclePolygons(geojson, 'RAD');
    // const geojsonText = JSON.stringify(result);
    // console.log(geojsonText); // 복사해서 geojson.io에 붙여보세요


    //circle(사실그냥 폴리곤) 시각화
    try {
        const dataSource = await GeoJsonDataSource.load(circleFeatureCollection);
        await viewer.dataSources.add(dataSource);
        await viewer.flyTo(dataSource);
    } catch (error) {
        console.error("폴리곤 로드 실패:", error);
    }



    const ConnectedPolygon = generateConnectedPolygon(circleFeatureCollection,'RAD', ruler);
    console.log("union 형태 :", JSON.stringify(resultPolygon));



    // //circle(사실그냥 폴리곤) 시각화
    // try {
    //     const dataSource = await GeoJsonDataSource.load(resultPolygon);
    //     await viewer.dataSources.add(dataSource);
    //     await viewer.flyTo(dataSource);
    // } catch (error) {
    //     console.error("폴리곤 로드 실패:", error);
    // }
    // console.log('✅ 연결된 Polygon 생성 완료: result.geojson');

    const finalFC = mergePolygonsAsFeatureCollection(circleFeatureCollection, ConnectedPolygon);
    const a = turf.union(finalFC)



    //circle(사실그냥 폴리곤) 시각화
    try {
        const dataSource = await GeoJsonDataSource.load(a);
        await viewer.dataSources.add(dataSource);
        await viewer.flyTo(dataSource);
    } catch (error) {
        console.error("폴리곤 로드 실패:", error);
    }
}


// 함수 실행

main()
// loadSidebar();