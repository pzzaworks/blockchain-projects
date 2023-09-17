const { loadImage } = require("canvas");

async function loadLayerElementImage(path) {
    return new Promise(async (resolve) => {
        const image = await loadImage(path);
        resolve({
            loadedImage: image,
        });
    });
};

module.exports = loadLayerElementImage;