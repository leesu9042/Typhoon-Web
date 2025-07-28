import * as turf from "@turf/turf";

// 테스트용 Ruler (turf 자체 사용)
const ruler = turf;




// ✅ 이렇게 고쳐야 함
import { generateConnectedPolygon } from './generateConnectedPolygon.js';

// 🧪 테스트용 FeatureCollection (circle → point → circle)
const featureCollection = {
    type: "FeatureCollection",
    features: [
        turf.circle([123.2, 18.75], 5, { steps: 64, properties: { radius: 5 } }),
        turf.point([123.25, 18.75], { radius: 2 }),
        turf.circle([123.3, 18.75], 5, { steps: 64, properties: { radius: 5 } }),
    ]
};

// 🟢 테스트 실행
const result = generateConnectedPolygon(featureCollection, "radius", ruler);

console.log("✅ 최종 결과:", result);
