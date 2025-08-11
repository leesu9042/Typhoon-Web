/**
 * 주어진 GeoJSON FeatureCollection에서,
 * polygon (circle)과 Point들을 조건에 따라 연결하여
 * 하나의 Polygon을 생성.
 *
 * - Polygon에서는 0번째와 중간점을 추출
 * - Point는 양 옆에 Polygon이 하나라도 있을 때만 사용
 *
 * @param {{type: string, features: *}} featureCollection
 * @param RadiusProperty
 * @param ruler
 * @returns
 */
export function generateConnectedPolygon(featureCollection,RadiusProperty,ruler) {

    const isPoint = f => f.geometry.type === "Point";

    const subPolygons  = [];
    const features = featureCollection.features;


    for (let i = 0; i < features.length -1; i++) {
        const current = features[i];
        const next = features[i + 1];


        if (!current || !next) continue;  //  방어 코드 추가


        if((isPoint(current) && isPoint(next)) || (!isPoint(current) && isPoint(next))) continue;
        //point,  point 는 만들 polygon이 없다
        // circle, point라면 -> point에서 더이상 값이없으므로 연결 안해도됨

        /**
         * @returns {Array<[number, number]>} polygon 좌표를 구성할 점 배열
         */
        const coords = getPolygonCoordsFromPair(current, next,RadiusProperty, ruler);
        //polygon 만들 좌표 생성 함수
        // circle이면 ±90° 방향으로 2개의 점,
        // point면 중심점 1개를 반환하게 될 함수

        console.log("coords 값:",coords);


        console.log(coords.length); // 3

        if (coords.length < 4) {
            console.warn("⚠️ Invalid polygon coordinates:", coords?.[0]);
            continue;
        }

        //반환된걸로 polygon만들고 push
        subPolygons.push(turf.polygon([coords])); // ✅ 배열로 한 번 더 감싸기




    }

    console.log("최종 polygon 좌표:", JSON.stringify(subPolygons));

    const featureCollection1 = turf.featureCollection(subPolygons)


    console.log("최종 polygon 좌표:", JSON.stringify(featureCollection1));


    if (featureCollection1.features.length === 0) {
        console.warn("⛔ 폴리곤이 0개라 union 못함");
        return null;  // 혹은 빈 FeatureCollection
    }



    if (featureCollection1.features.length === 1) {
        console.log(" polygon이 1개 → union 없이 그대로 반환");
        return featureCollection1.features[0]; // Feature만 반환
    } //[ point , Circle]만 있는경우 union을 못함 그래서 바로 처리






    return turf.union(featureCollection1);
}
import * as turf from "@turf/turf";

import {getPolygonCoordsFromPair} from "./getPolygonCoordsFromPair.js";
