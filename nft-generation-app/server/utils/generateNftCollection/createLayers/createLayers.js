const fs = require('fs-extra');
const path = require('path');

const createElements = require('./createElements');

function createLayers(result, layerIndexes, fields){
    const layers = layerIndexes.map((layer, i) => ({
        index: i + 1,
        name: JSON.parse(fields.layers).layers[i].name,
        type: JSON.parse(fields.layers).layers[i].type,
        effect: JSON.parse(fields.layers).layers[i].effect,
        font: JSON.parse(fields.layers).layers[i].font,
        size: JSON.parse(fields.layers).layers[i].size,
        color: JSON.parse(fields.layers).layers[i].color,
        text: JSON.parse(fields.layers).layers[i].text,
        counter: JSON.parse(fields.layers).layers[i].counter,
        position: JSON.parse(fields.layers).layers[i].position,
        positionPadding: JSON.parse(fields.layers).layers[i].positionPadding,
        elementCount: JSON.parse(fields.layers).layers[i].elements.length,
        elements: createElements(result, i + 1, JSON.parse(fields.layers).layers[i].elements),
        path: path.join(__basedir, '/build/uploads/layers/layer' + (i + 1).toString())
    }));
    return layers;
};

module.exports = createLayers;