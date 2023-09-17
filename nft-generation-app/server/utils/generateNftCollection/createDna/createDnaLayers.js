function createDnaLayers(newDna, layers) {
    let dnaLayers = layers.map((layer, index) => {
        let selectedElement = layer.elements.find(
            (element) => element.index === Number(newDna[index])
        );
        return {
            name: layer.name,
            type: layer.type,
            effect: layer.effect,
            font: layer.font,
            size: layer.size,
            color: layer.color,
            text: layer.text,
            counter: layer.counter,
            position: layer.position,
            positionPadding: layer.positionPadding,
            selectedElement: selectedElement,
        };
    });
    return dnaLayers;
};

module.exports = createDnaLayers;