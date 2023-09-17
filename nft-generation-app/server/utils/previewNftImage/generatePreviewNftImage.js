const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');
const loadLayerElementImage = require('./loadLayerElementImage');

async function generatePreviewNftImage(result, fields) {
    try {
        let canvas = createCanvas(parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));
        let context = canvas.getContext('2d');
        let loadedLayerElementImages = [];

        for(let i=0; i < fields.previewNftImageLayerElementCount; i++) {
            if (fs.existsSync(path.join(__basedir, '/build/uploads/layers/layer' + (i + 1).toString() + '/' + JSON.parse(fields.previewNftImageLayerElements)[i] + 'Image.png'))) { 
                let currentLayerElementImagePath = path.join(__basedir, '/build/uploads/layers/layer' + (i + 1).toString() + '/' + JSON.parse(fields.previewNftImageLayerElements)[i] + 'Image.png');
                loadedLayerElementImages.push(loadLayerElementImage(currentLayerElementImagePath));
            } else {
                result.status(200).send({
                    type: 'error',
                    message: "Some elements have no image uploaded or didn't select."
                });
            }
        }
        await Promise.all(loadedLayerElementImages).then((renderObjectArray) => {
            context.clearRect(0, 0, parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));

            renderObjectArray.forEach((renderObject, index) => {
                context.globalAlpha = 1;
                context.globalCompositeOperation = JSON.parse(fields.layers)[index].elements[parseInt(JSON.parse(fields.previewNftImageLayerElements)[index].split('Element')[1])];
            
                if (fields.pixelArtActive == 'true') {
                    context.imageSmoothingEnabled = false;
                } else {
                    context.imageSmoothingEnabled = true;
                }

                context.drawImage(renderObject.loadedImage, 0, 0, parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));
            });
        });

        fs.writeFileSync(path.join(__basedir, '/build/previewNftImage/previewNftImage.png'), canvas.toBuffer('image/png'));

        result.status(200).send({
            type: 'success',
            message: 'Preview Nft image created.'
        });
    } catch (error) {}
}

module.exports = generatePreviewNftImage;