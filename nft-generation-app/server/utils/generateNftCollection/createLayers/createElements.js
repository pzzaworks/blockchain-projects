const fs = require('fs-extra');
const path = require('path');

const createElements = (result, layerIndex, elements) => {
    if(fs.existsSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString()))) {
        return fs.readdirSync(path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString())).map((file, i) => {
            return {
                index: i + 1,
                name: elements[i].name,
                layer: 'layer' + layerIndex.toString(),
                rarity: elements[i].rarity,
                uniqueNftName: elements[i].uniqueNftName,
                group: elements[i].group,
                isUniqueGenerated: false,
                path: path.join(__basedir, '/build/uploads/layers/layer' + layerIndex.toString() + '/layer' + layerIndex.toString() + 'Element' + (i + 1).toString() + 'Image.png')
            };
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: 'Please upload images for elements of layer ' + layerIndex.toString() + '.'
        });
    }
};

module.exports = createElements;