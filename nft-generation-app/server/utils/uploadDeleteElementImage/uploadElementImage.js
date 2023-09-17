const fs = require('fs-extra');
const path = require('path');

function uploadElementImage(result, fields, files){
    let layerIndex = parseInt(fields.layerIndex) + 1;
    let elementIndex = parseInt(fields.elementIndex) + 1;

    if (!fs.existsSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString()))) { 
        fs.mkdirSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString()));
    }

    fs.renameSync(files.image.filepath, path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString() + '/layer' + layerIndex.toString() + 'Element' + elementIndex.toString() + 'Image.png'));

    result.status(200).send({
        type: 'success',
        message: "Image uploaded successfully."
    });

};

module.exports = uploadElementImage;