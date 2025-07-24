// copy-cesium-assets.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const cesiumBuildPath = path.resolve(__dirname, 'node_modules/cesium/Build/Cesium');
const targetPath = path.resolve(__dirname, 'static/cesium');

const foldersToCopy = ['Assets', 'Widgets', 'Workers', 'ThirdParty'];

foldersToCopy.forEach(folder => {
    const src = path.join(cesiumBuildPath, folder);
    const dest = path.join(targetPath, folder);
    fse.copySync(src, dest);
    console.log(`Copied ${folder} to ${dest}`);
});
