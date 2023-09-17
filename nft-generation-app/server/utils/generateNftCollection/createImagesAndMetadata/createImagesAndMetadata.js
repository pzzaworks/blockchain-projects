const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');
const sha1 = require('sha1');
const addExtraMetadataFields = require('./addExtraMetadataFields');

function createImagesAndMetadata(fields, renderObjectArray, itemIndexes, newDna) {
    let canvas = createCanvas(parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));
    let context = canvas.getContext('2d');
    let attributesList = [];

    context.clearRect(0, 0, parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));

    renderObjectArray.forEach((renderObject, index) => {
        context.globalAlpha = 1;
        context.globalCompositeOperation = renderObject.layer.effect;

        if(renderObject.layer.type === 'image') {
            if (fields.pixelArtActive == 'true') {
                context.imageSmoothingEnabled = false;
            } else {
                context.imageSmoothingEnabled = true;
            }
    
            context.drawImage(renderObject.loadedImage, 0, 0, parseInt(fields.nftItemSizeWidth), parseInt(fields.nftItemSizeHeight));

            attributesList.push({
                trait_type: renderObject.layer.name,
                value: renderObject.layer.selectedElement.name,
            });
    
            if(index == parseInt(JSON.parse(fields.layers).layerCount) - 1) {
                if(renderObject.layer.selectedElement.uniqueNftName != ''){
                    attributesList.push({
                        trait_type: 'Name',
                        value: renderObject.layer.selectedElement.uniqueNftName,
                    });
                }
            }
        } else if(renderObject.layer.type === 'text') {
            let positionX = 0;
            let positionY = 0;
            let textValue = '';
            context.fillStyle = renderObject.layer.color;
            context.font = renderObject.layer.size + 'pt ' + renderObject.layer.font;

            if(renderObject.layer.counter === 'true') {
                textValue = renderObject.layer.text + itemIndexes[0];
            } else {
                textValue = renderObject.layer.text;
            }

            switch(renderObject.layer.position) {
                case 'topLeft':
                    context.textAlign = 'left';
                    positionX = parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(renderObject.layer.size) + parseInt(renderObject.layer.positionPadding);
                break;
                case 'topCenter':
                    context.textAlign = 'center';
                    positionX = parseInt(fields.nftItemSizeWidth) / 2;
                    positionY = parseInt(renderObject.layer.size) + parseInt(renderObject.layer.positionPadding);
                break;
                case 'topRight':
                    context.textAlign = 'right';
                    positionX = parseInt(fields.nftItemSizeWidth) - parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(renderObject.layer.size) + parseInt(renderObject.layer.positionPadding);
                break;
                case 'left':
                    context.textAlign = 'left';
                    positionX = parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(fields.nftItemSizeHeight) / 2;
                break;
                case 'center':
                    context.textAlign = 'center';
                    positionX = parseInt(fields.nftItemSizeWidth) / 2;
                    positionY = parseInt(fields.nftItemSizeHeight) / 2;
                break;
                case 'right':
                    context.textAlign = 'right';
                    positionX = parseInt(fields.nftItemSizeWidth) - parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(fields.nftItemSizeHeight) / 2;
                break;
                case 'bottomLeft':
                    context.textAlign = 'left';
                    positionX = parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(fields.nftItemSizeHeight) - parseInt(renderObject.layer.positionPadding);
                break;
                case 'bottomCenter':
                    context.textAlign = 'center';
                    positionX = parseInt(fields.nftItemSizeWidth) / 2;
                    positionY = parseInt(fields.nftItemSizeHeight) - parseInt(renderObject.layer.positionPadding);
                break;
                case 'bottomRight':
                    context.textAlign = 'right';
                    positionX = parseInt(fields.nftItemSizeWidth) - parseInt(renderObject.layer.positionPadding);
                    positionY = parseInt(fields.nftItemSizeHeight) - parseInt(renderObject.layer.positionPadding);
                break;
            }

            context.fillText(textValue, positionX, positionY);

            attributesList.push({
                trait_type: renderObject.layer.name,
                value: textValue,
            });
        }
    });
    
    fs.writeFileSync(path.join(__basedir, '/build/nftCollection/images/' + itemIndexes[0] + '.png'), canvas.toBuffer('image/png'));

    let tempMetadata = {};
    
    let tempMetadataBaseFields = {
        id: itemIndexes[0],
        name: fields.nftItemName + ' #' + itemIndexes[0],
        description: fields.collectionDescription,
    }

    let tempMetadataExtraMetadataFields = addExtraMetadataFields(JSON.parse(fields.extraMetadataFields));

    let tempMetadataSecondaryFields = {
        dna: sha1(newDna),
        image: fields.baseURI + '/' + itemIndexes[0] + '.png',
        attributes: attributesList,
    }

    let tempMetadataCombined = {};

    if(tempMetadataExtraMetadataFields != {}){
        tempMetadataCombined = Object.assign(tempMetadataBaseFields, tempMetadataExtraMetadataFields);
        tempMetadata = Object.assign(tempMetadataCombined, tempMetadataSecondaryFields);
    } else {
        tempMetadataCombined = Object.assign(tempMetadataBaseFields, tempMetadataSecondaryFields);
        tempMetadata = tempMetadataCombined;
    }

    attributesList = [];

    let metadata = tempMetadata;
    fs.writeFileSync(path.join(__basedir, '/build/nftCollection/json/' + itemIndexes[0] + '.json'), JSON.stringify(metadata, null, 2));
}

module.exports = createImagesAndMetadata;