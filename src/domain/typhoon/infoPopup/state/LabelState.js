// src/domain/typhoon/entity/state/LabelState.js

let activeLabel = null;

export function setActiveLabel(label) {
    activeLabel = label;
}

export function getActiveLabel() {
    return activeLabel;
}

export function clearActiveLabel() {
    activeLabel = null;
}
