import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import * as Cesium from "cesium";
import {generateWindInfoText} from "../utils/formatWindRadiusInfo.js";


/**
 * 태풍 Entity 객체에서 정보를 추출하여 HTML 템플릿 반환
 * @param {Entity} entity
 * @returns {TemplateResult}
 */
export function createEntityInfoTemplate(entity) {
    const props = entity?.properties || {};
    const getVal = (key) => props[key]?.getValue?.() ?? '-';

    // 데이터 추출
    const ft = getVal('FT');
    const infoType = ft === 1 ? '예측정보' : '관측정보';
    const yy = getVal('YY');
    const typ = getVal('TYP');
    const name = getVal('TYP_NAME') ?? '-'; //todo(entity에 태풍이름 데이터 가져와야함 )
    const ft_tm = getVal('FT_TM');

    // 날짜 포맷
    const formatDate = (raw) => {
        const str = String(raw);
        if (!str || str.length < 10) return '-';
        return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}. ${str.slice(8, 10)}시`;
    };

    const dateStr = formatDate(ft_tm);

    // 위도/경도
    const formatLat = (lat) => {
        const val = Number(lat);
        if (isNaN(val)) return '-';
        return `${Math.abs(val).toFixed(1)} ° ${val >= 0 ? 'N' : 'S'}`;
    };

    const formatLon = (lon) => {
        const val = Number(lon);
        if (isNaN(val)) return '-';
        return `${Math.abs(val).toFixed(1)} ° ${val >= 0 ? 'E' : 'W'}`;
    };

    // 위치 및 주요 값
    const lat = getVal('LAT');
    const lon = getVal('LON');
    const location = getVal('LOC');
    const ws = getVal('WS');
    const ps = getVal('PS');
    const rad15 = getVal('RAD15');
    const rad25 = getVal('RAD25');
    const ed15 = getVal('ED15');
    const er15 = getVal('ER15');
    const ed25 = getVal('ED25');
    const er25 = getVal('ER25R');
    const TYP_CLASS = getVal('TYP_CLASS');



    const rad15Text  = generateWindInfoText(rad15, ed15 , er15)
    const rad25Text  = generateWindInfoText(rad25, ed25 , er25)

    // const er15Text = display(er15) === '-' ? '' : `(${ed15} 약 ${er15} km)`;
    // const er25Text = display(er25) === '-' ? '' : `(${ed25} 약 ${er25} km)`;





    //htmlTem 만들어서 리턴

    return html`
        <div class="entity-info-box">
            <div><strong>${yy}년 제${typ}호 태풍 ${name} ${infoType}</strong><br />
                    (${dateStr})</div><br />
            
            

            중심위치: ${formatLat(lat)}, ${formatLon(lon)}<br />
            - ${location}<br />
            최대풍속(중심기압): ${ws} m/s (${ps} hPa) <br />
            강풍반경(예외반경): ${rad15Text}<br />
            폭풍반경(예외반경): ${rad25Text}<br />
            태풍세기 : ${TYP_CLASS}<br />
            
        </div>
    `;
}
