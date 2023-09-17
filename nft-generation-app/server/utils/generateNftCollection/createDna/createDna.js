const getRarityDataDynamically = require('./getRarityDataDynamically');
const selectRandomElementIndex = require('./selectRandomElementIndex');

function createDna(result, fields, layers, generatedUniqueNftNames){
    let currentDna = [];
    let currentDnaUniqueNftName = 'none';
    let currentDnaGroupName = 'none';
    let selectedElementIndex = -1;
    
    layers.forEach((layer) => {
        if(layer.type === 'image') {
            let rarityData = getRarityDataDynamically(layer);
            selectedElementIndex = selectRandomElementIndex(layer, rarityData, currentDnaUniqueNftName, currentDnaGroupName, generatedUniqueNftNames);
    
            if(layer.index == 1 && 
               currentDnaUniqueNftName == 'none' && 
               layer.elements[selectedElementIndex - 1].rarity == 'unique' && 
               layer.elements[selectedElementIndex - 1].uniqueNftName != 'none') {
               currentDnaUniqueNftName = layer.elements[selectedElementIndex - 1].uniqueNftName;
            } 
        } else if(layer.type === 'text') {
            selectedElementIndex = Math.floor(Math.random() * parseInt(fields.nftItemCount)) + 1;
        }

        currentDna.push(selectedElementIndex);
    });

    if(selectedElementIndex == -1) {
        result.status(200).send({
            type: 'error',
            message: "You need more common rarity elements to generate nft collection with this item count."
        });
    } else {
        return currentDna;
    }

};

module.exports = createDna;