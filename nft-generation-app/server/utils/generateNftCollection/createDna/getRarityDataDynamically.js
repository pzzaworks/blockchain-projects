function getRarityDataDynamically(layer) {
    let rarityData = [
        { rarity: 'common', weight: 70 },
        { rarity: 'rare', weight: 20 },
        { rarity: 'epic', weight: 8 },
        { rarity: 'legend', weight: 2 },
        { rarity: 'unique', weight: 1 },
    ];

    let rarityList = ['common', 'rare', 'epic', 'legend', 'unique'];
    let elementsRarityList = [];

    for(let i = 0; i < layer.elements.length; i++) {
        if(elementsRarityList.findIndex(rarity => rarity === layer.elements[i].rarity) == -1) {
            elementsRarityList.push(layer.elements[i].rarity);
        }
    }

    let newRarityList = rarityList;

    for(let i = 0; i < elementsRarityList.length; i++) {
        newRarityList = newRarityList.filter(rarity => rarity !== elementsRarityList[i]);
    }

    let elementsUniqueRarityList = [];
    for(let i = 0; i < layer.elements.length; i++) {
        if(layer.elements[i].rarity == 'unique') {
            elementsUniqueRarityList.push(i);
        }
    }

    if(elementsUniqueRarityList.length == 1) {
        if(layer.elements[elementsUniqueRarityList[0]].isUniqueGenerated == true) {
            newRarityList.push('unique');
        }
    }

    let updatedRarityData = rarityData;

    for(let i = 0; i < newRarityList.length; i++) {
        updatedRarityData = updatedRarityData.filter(data => data.rarity !== newRarityList[i]);
    }

    if(updatedRarityData.length < rarityData.length) {
        return updatedRarityData;
    } else {
        return rarityData;
    }
}

module.exports = getRarityDataDynamically;