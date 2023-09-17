const getRandomRarity = require('./getRandomRarity');

function selectRandomElementIndex(layer, rarityData, currentDnaUniqueNftName, currentDnaGroupName, generatedUniqueNftNames){ 
    let selectedElementIndex = -1;
    let randomRarity = '';
    let sameRarityElements = [];

    if(currentDnaGroupName == 'none') {} else {}

    if(currentDnaUniqueNftName == 'none' || generatedUniqueNftNames.findIndex(uniqueNftName => uniqueNftName === currentDnaUniqueNftName) !== -1) {
            randomRarity = getRandomRarity(rarityData);

        for(let i = 0; i < layer.elements.length; i++) {
            if(layer.elements[i].rarity == randomRarity) {
                sameRarityElements.push(i);
            }
        }
    
        let randomSameRarityElementIndex = Math.floor(Math.random() * sameRarityElements.length);
        let selectRandomSameRarityElement = sameRarityElements[randomSameRarityElementIndex];
        selectedElementIndex = layer.elements[selectRandomSameRarityElement].index;
    
        if(randomRarity == 'unique') {
            if(layer.elements[selectRandomSameRarityElement].isUniqueGenerated == false) {
                if(layer.index == 1) {
                    layer.elements[selectRandomSameRarityElement].isUniqueGenerated = true;
                    return selectedElementIndex;
                } else {
                    if(layer.elements[selectRandomSameRarityElement].uniqueNftName == 'none') {
                        layer.elements[selectRandomSameRarityElement].isUniqueGenerated = true;
                        return selectedElementIndex;
                    } else {
                        selectRandomElementIndex(layer, rarityData, currentDnaUniqueNftName);
                    }
                }
            } else {
                selectRandomElementIndex(layer, rarityData, currentDnaUniqueNftName);
            }
        }
        
        return selectedElementIndex;
    } else {
        randomRarity = 'unique';
        
        for(let i = 0; i < layer.elements.length; i++) {
            if(layer.elements[i].rarity == randomRarity && 
                layer.elements[i].uniqueNftName == currentDnaUniqueNftName && 
                layer.elements[i].isUniqueGenerated == false) {
                layer.elements[i].isUniqueGenerated = true;
                selectedElementIndex = layer.elements[i].index;
            }
        }

        return selectedElementIndex;
    }
}

module.exports = selectRandomElementIndex;