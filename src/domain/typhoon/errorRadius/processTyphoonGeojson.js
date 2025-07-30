// src/domain/typhoon/init/processTyphoonGeojson.js

import { GeoJsonDataSource } from "cesium";
import * as turf from "@turf/turf";
import pkg from 'cheap-ruler';
import {PointMarker} from "../visualize/pointMarker.js";
import {geojsonPointsToLineString} from "../util/polyLine/createPolylines.js";
import {addLineStringToViewer} from "../visualize/addLineStringToViewer.js";
import {createCirclePolygons} from "../util/circle/createCirclePolygon.js";
import {generateConnectedPolygon} from "../util/polygon/createPolygon/generateConnectedPolygon.js";
import {mergePolygonsAsFeatureCollection} from "../util/polygon/mergePolygonsAsFeatureCollection.js";


/**
 * 태풍 GeoJSON 데이터를 시각화 및 가공합니다.
 * @param {Cesium.Viewer} viewer - Cesium viewer 객체
 * @param {Object} geojson - GeoJSON 형식의 태풍 데이터
 */
export async function processTyphoonGeojson(viewer,RADproperty, geojson) {


    viewer.dataSources.removeAll();

    // 1. 포인트 마커 시각화
    await PointMarker(viewer, geojson, '/static/img/typhoon_invert.png');

    // 2. LineString 생성 및 시각화
    const lineGeoJson = geojsonPointsToLineString(geojson);
    console.log("📍 Line GeoJSON:", JSON.stringify(lineGeoJson, null, 2));
    await addLineStringToViewer(viewer, lineGeoJson);

    // 3. 거리 계산을 위한 CheapRuler 초기화
    const CheapRuler = pkg.default || pkg;
    const ruler = new CheapRuler(20.5, 'kilometers');

    // 4. 반지름(RAD) 기반 원형 폴리곤 생성
    const circleFeatureCollection = createCirclePolygons(geojson, RADproperty, ruler);
    console.log("🔵 Circle FeatureCollection:", JSON.stringify(circleFeatureCollection, null, 2));

    // 5. Circle 폴리곤만 필터링
    const onlyPolygons = {
        type: "FeatureCollection",
        features: circleFeatureCollection.features.filter(
            f => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
        ),
    };

    // 6. Circle 폴리곤 시각화
    try {
        const dataSource = await GeoJsonDataSource.load(onlyPolygons);
        await viewer.dataSources.add(dataSource);
    } catch (error) {
        console.error("❌ Circle 폴리곤 로드 실패:", error);
    }

    // 7. 연결 폴리곤 생성 및 union
    const connectedPolygon = generateConnectedPolygon(circleFeatureCollection, RADproperty, ruler);
    console.log("🧩 연결 Polygon:", JSON.stringify(connectedPolygon));

    const finalFC = mergePolygonsAsFeatureCollection(circleFeatureCollection, connectedPolygon);
    const unioned = turf.union(finalFC);

    // 8. 최종 union된 데이터 시각화
    try {
        const dataSource = await GeoJsonDataSource.load(unioned);
        await viewer.dataSources.add(dataSource);
    } catch (error) {
        console.error("❌ 최종 union 폴리곤 로드 실패:", error);
    }
}
