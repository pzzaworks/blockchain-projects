const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require("canvas");

async function generateCollageImage(result, fields, metadataList, imageSize) {
    let canSaveCollageImage = true;
    const collageImageCanvasWidth = imageSize.width * parseInt(fields.collageImageColumnCount);
    const collageImageCanvasHeight = imageSize.height * parseInt(fields.collageImageRowCount);

    if (collageImageCanvasWidth < 20000 && collageImageCanvasHeight < 20000) {

        let collageImagePath;

        if(fields.roundSystemActive === 'false') {
            collageImagePath = path.join(__basedir, '/build/collageImage/collageImage.png');
        } else {
            collageImagePath = path.join(__basedir, '/build/collageImage/collageImageWithRounds.png');
        }
        
        const collageImageCanvas = createCanvas(collageImageCanvasWidth, collageImageCanvasHeight);
        const collageImageContext = collageImageCanvas.getContext("2d");

        let index = -1;

        for (let i = 0; i < parseInt(fields.collageImageColumnCount); i++) {
            for (let j = 0; j < parseInt(fields.collageImageRowCount); j++) {

                index++;
                let currentNft = metadataList[index];

                if (currentNft !== undefined) {

                    let currentNftPath;

                    if(fields.roundSystemActive === 'false') {
                        currentNftPath = path.join(__basedir, '/build/nftCollection/images/' + currentNft.id + '.png');
                    } else {
                        currentNftPath = path.join(__basedir, '/build/nftCollectionWithRounds/images/' + currentNft.id + '.png');
                    }

                    await loadImage(currentNftPath).then((image) => {
                       
                        if (currentNft.id !== undefined) {
                            if (collageImageCanvasWidth < 20000 && collageImageCanvasHeight < 20000) {

                                if (fields.pixelArtActive == 'true') {
                                    collageImageContext.imageSmoothingEnabled = false;
                                } else {
                                    collageImageContext.imageSmoothingEnabled = true;
                                }

                                collageImageContext.drawImage(
                                    image,
                                    imageSize.width * (i % parseInt(fields.collageImageColumnCount)),
                                    imageSize.height * (j % parseInt(fields.collageImageRowCount)),
                                    imageSize.width,
                                    imageSize.height
                                );
                            } else {
                                result.status(200).send({
                                    type: 'error',
                                    message: 'You reached maximum width or height pixel values, write lower values for row or column item counts.'
                                });
                            }

                        } else {
                            canSaveCollageImage = false;
                            result.status(200).send({
                                type: 'error',
                                message: 'The product of the row and column item counts must be less or equal to the total item count.'
                            });
                        }

                    });

                } else {
                    canSaveCollageImage = false;
                    result.status(200).send({
                        type: 'error',
                        message: 'The product of the row and column item counts must be less or equal to the total item count.'
                    });
                }
            }
        }

        if (canSaveCollageImage) {
            fs.writeFileSync(collageImagePath, collageImageCanvas.toBuffer("image/png"));
            result.status(200).send({
                type: 'success',
                message: 'Collage Image successfully generated.'
            });
        }

    } else {
        result.status(200).send({
            type: 'error',
            message: 'You reached maximum width or height pixel values, write lower values for row or column item counts.'
        });
    }
};

module.exports = generateCollageImage;