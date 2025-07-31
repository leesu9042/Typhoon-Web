// src/domain/typhoon/init/renderCirclePolygons.js

import { GeoJsonDataSource } from "cesium";
import * as turf from "@turf/turf";
import pkg from 'cheap-ruler';
import { renderTyphoonPoints} from "../visualize/renderTyphoonPoints.js";
import {geojsonPointsToLineString} from "../util/polyLine/createPolylines.js";
import { renderTyphoonPath} from "../visualize/renderTyphoonPath.js";
import {createCirclePolygons} from "../util/circle/createCirclePolygon.js";
import {generateConnectedPolygon} from "../util/polygon/createPolygon/generateConnectedPolygon.js";
import {mergePolygonsAsFeatureCollection} from "../util/polygon/mergePolygonsAsFeatureCollection.js";
import {loadGeoJsonToViewer} from "../../../shared/cesium/loadGeoJsonToViewer.js";
import * as Cesium from "cesium";
import {renderCirclePolygons} from "../visualize/renderCirclePolygons.js";
import {renderFinalUnionedPolygon} from "../visualize/renderFinalUnionedPolygon.js";


/**
 * 태풍 GeoJSON 데이터를 시각화 및 가공합니다.
 * @param {Cesium.Viewer} viewer - Cesium viewer 객체
 * @param {Object} geojson - GeoJSON FeatureCollection (모든 feature는 Point 타입)
 *
 **/
export async function processTyphoonGeojson(viewer,RADproperty, geojson) {


    // 초기화
    viewer.dataSources.removeAll();
    let maxSeq = getMaxSeq(geojson)
    const CheapRuler = pkg.default || pkg;
    const ruler = new CheapRuler(20.5, 'kilometers');


    // // 1. 포인트 마커 시각화
    await renderTyphoonPoints(viewer, geojson,maxSeq);

    // 2. LineString 생성 및 시각화
    const lineGeoJson = geojsonPointsToLineString(geojson);
    console.log(" Line GeoJSON:", JSON.stringify(lineGeoJson, null, 2));
    await renderTyphoonPath(viewer, lineGeoJson);


    // 3. 반지름(RAD) 기반 원형 폴리곤 생성
    const circleFeatureCollection = createCirclePolygons(geojson, RADproperty, ruler);
    console.log(" Circle FeatureCollection:", JSON.stringify(circleFeatureCollection, null, 2));

    // 4. Circle 폴리곤만 필터링 후 시각화
    await renderCirclePolygons(viewer, circleFeatureCollection);

    // 5. 연결 폴리곤 생성 및 union
    const connectedPolygon = generateConnectedPolygon(circleFeatureCollection, RADproperty, ruler);
    console.log(" 연결 Polygon:", JSON.stringify(connectedPolygon));

    //6. 원 + 연결폴리곤 배열 연결한 featureCollection생성
    const finalFC = mergePolygonsAsFeatureCollection(circleFeatureCollection, connectedPolygon);
    console.log(" Final FC:", JSON.stringify(finalFC));

    //7.  원 연결 폴리곤 + 원  하나로 합치기 ( 바깥 line따기 )
    const unioned = turf.union(finalFC);

    // 8. 최종 union된 데이터 시각화
    await renderFinalUnionedPolygon(viewer, unioned);


}


function getMaxSeq(featureCollection) {
    if (!featureCollection || !Array.isArray(featureCollection.features)) return null;

    return Math.max(
        ...featureCollection.features
            .map(f => f.properties?.SEQ)
            .filter(seq => typeof seq === 'number')
    );
}