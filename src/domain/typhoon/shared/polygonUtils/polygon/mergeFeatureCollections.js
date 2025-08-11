import * as turf from "@turf/turf";

/**
 * 두 FeatureCollection을 병합해서 하나의 FeatureCollection으로 반환
 * @param {FeatureCollection} fc1
 * @param {FeatureCollection} fc2
 * @returns {FeatureCollection}
 */
export function mergeFeatureCollections(fc1, fc2) {
    const features = [
        ...(fc1?.features || []),
        ...(fc2?.features || []),
    ];

    return turf.featureCollection(features);
}