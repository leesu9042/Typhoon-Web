import * as turf from "@turf/turf";
import pkg from 'cheap-ruler';
import CheapRuler from "cheap-ruler";



export function getPolygonCoordsFromPair(current, next,radiusProperty ) {

    const isPoint = f => f.geometry.type === "Point";
    const isCircle = f => f.geometry.type === "Polygon";
    const coords = []



    //circle, point인경우
    if ((isCircle(current) && isPoint(next)) || (isCircle(next) && isPoint(current))) {

        const circleFeature = isCircle(current) ? current : next;
        const pointFeature = isPoint(current) ? current : next;

        // const circleCoord = circleFeature.geometry.coordinates
        // const pointCoord = pointFeature.geometry.coordinates;

        const circleCoord = circleFeature.properties.center;
        const pointCoord = pointFeature.geometry.coordinates;




        const circlePropertyValue = parseFloat(circleFeature.properties[radiusProperty]) || 0



        //위도 가져오기
        const circleLat = circleCoord[1];
        const pointLat = pointCoord[1];

        const avgLat = (circleLat + pointLat) / 2;

        const ruler = new CheapRuler(avgLat, "kilometers");





        // 이전 지점과 현재 지점 사이의 방위각 계산
        let bearing = ruler.bearing(pointCoord, circleCoord);

        // 방위각 기준으로 반경 값을 사용해 사각형 꼭짓점 계산
        let p1 = pointCoord;
        let p2 = ruler.destination(circleCoord, circlePropertyValue, bearing + 90);
        let p3 = ruler.destination(circleCoord, circlePropertyValue, bearing - 90);

        console.log("▶️ p1:", p1);
        console.log("▶️ p2:", p2);
        console.log("▶️ p3:", p3);

        coords.push(p1,p2,p3)

    }else if (isCircle(current) && isCircle(next)) {
        //circle, circle 인경우
        const currentFeature = isCircle(current) ? current : null;
        const nextFeature = isCircle(next) ? next : null;


        // const currentCoord = currentFeature.geometry.coordinates
        // const nextCoord = nextFeature.geometry.coordinates;

        const currentCoord = currentFeature.properties.center;
        const nextCoord = nextFeature.properties.center;



        const currentPropertyValue = parseFloat(currentFeature.properties[radiusProperty]) || 0
        const nextPropertyValue = parseFloat(nextFeature.properties[radiusProperty]) || 0;


        // 평균 위도 기반으로 ruler 생성
        const avgLat = (currentCoord[1] + nextCoord[1]) / 2;
        const ruler = new CheapRuler(avgLat, "kilometers");

        // 이전 지점과 현재 지점 사이의 방위각 계산
        let bearing = ruler.bearing(currentCoord, nextCoord);

        // 방위각 기준으로 반경 값을 사용해 사각형 꼭짓점 계산
        let p1 = ruler.destination(currentCoord, currentPropertyValue, bearing + 90);
        let p2 = ruler.destination(nextCoord, nextPropertyValue, bearing + 90);
        let p3 = ruler.destination(nextCoord, nextPropertyValue, bearing - 90);
        let p4 = ruler.destination(currentCoord, currentPropertyValue, bearing - 90);


        console.log("▶️ p1:", p1);
        console.log("▶️ p2:", p2);
        console.log("▶️ p3:", p3);
        console.log("▶️ p4:", p4);

        coords.push(p1,p2,p3,p4)
    }   else {

        console.warn("지원하지 않는 geometry type입니다:", current.geometry.type, next.geometry.type);
        return null; // 또는 undefined
    }





// polygon 닫기 전에 로그
    console.log("📌 polygon 좌표 (닫기 전):", JSON.stringify(coords));

// polygon 닫기
    coords.push(coords[0]);

// 닫은 뒤 로그
    console.log("✅ polygon 좌표 (닫은 후):", JSON.stringify(coords));



    return coords; // turf.polygon() 쓰기위해  한번더 배열로 감싸기
}





