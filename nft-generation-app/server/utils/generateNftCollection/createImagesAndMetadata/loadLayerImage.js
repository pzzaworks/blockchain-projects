const path = require('path');
const { loadImage } = require("canvas");

async function loadLayerImage(layer) {
    return new Promise(async (resolve) => {
        const image = await loadImage(layer.selectedElement.path);
        resolve({
            layer: layer,
            loadedImage: image,
        });
    });
};

module.exports = loadLayerImage;