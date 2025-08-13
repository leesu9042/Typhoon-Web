


export function generateWindInfoText(RAD, ED, ER) {
    const toNumber = (val) => {
        const num = Number(val);
        return isNaN(num) ? null : num;
    };

    const radVal = toNumber(RAD);
    const erVal = toNumber(ER);

    let windInfoText = '';

    // 1. 기본 반경 (RAD)
    if (radVal === null || radVal <= 0) {
        windInfoText += '- km';

        return windInfoText;

    } else {
        windInfoText += `${radVal} km`;
    }

    // 2. 예외 반경 + 방향
    if (!ED || ED === '-' || erVal === null || erVal <= 0) {
        windInfoText += ' ( - )';
    } else {
        windInfoText += `(${ED}방향 약 ${erVal} km)`;
    }

    return windInfoText;
}
