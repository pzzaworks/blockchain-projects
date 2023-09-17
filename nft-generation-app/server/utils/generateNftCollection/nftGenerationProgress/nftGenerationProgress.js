const { loadImage } = require("canvas");

const fs = require('fs-extra');
const path = require('path');

function nftGenerationProgress(result, fields) {
    if(fs.existsSync(path.join(__basedir, '/build/nftCollection/images/' + fields.currentItemIndex.toString() + '.png'))) {
        result.status(200).send({
            type: 'success'
        });
    } else {
        result.status(200).send({
            type: 'error'
        });
    }
}

module.exports = nftGenerationProgress;