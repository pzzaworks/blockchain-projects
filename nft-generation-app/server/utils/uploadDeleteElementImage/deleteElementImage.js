const fs = require('fs-extra');
const path = require('path');

function deleteElementImage(result, fields){
    let layerIndex = parseInt(fields.layerIndex) + 1;
    let elementIndex = parseInt(fields.elementIndex) + 1;

    if (fs.existsSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString() + '/layer' + layerIndex.toString() + 'Element' + elementIndex.toString() + 'Image' + '.png'))) { 
        fs.unlinkSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString() + '/layer' + layerIndex.toString() + 'Element' + elementIndex.toString() + 'Image' + '.png'));
    }

    result.status(200).send({
        type: 'success',
        message: "Image deleted successfully."
    });
};

module.exports = deleteElementImage;