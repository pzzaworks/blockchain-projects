function selectNftItemRarity(nftItemRarity, nftItemCountUnique) {
    let updatedNftItemRarity = [];
    let itemCount = nftItemRarity.length;

    let nftItemsUnique = [];
    let nftItemsLegend = [];
    let nftItemsEpic = [];
    let nftItemsRare = [];
    let nftItemsCommon = [];

    let nftItemsUniqueNextIndex = 0;
    let nftItemsLegendNextIndex = 0;
    let nftItemsEpicNextIndex = 0;
    let nftItemsRareNextIndex = 0;
    
    let nftItemsLegendLastItem;
    let nftItemsEpicLastItem;
    let nftItemsRareLastItem;

    //Select Unique Nft Items and add them to the list

    for(let i = 0; i < nftItemCountUnique; i++) {
        nftItemsUnique.push(nftItemRarity[i]);
    }

    nftItemsUniqueNextIndex = nftItemsUnique.length;

    //Select Legend Nft Items and add them to the list

    for(let i = nftItemsUniqueNextIndex; i < Math.floor(nftItemsUniqueNextIndex + ((itemCount - nftItemsUniqueNextIndex) * 2 / 100)); i++) {
        nftItemsLegend.push(nftItemRarity[i]);
    }

    nftItemsLegendNextIndex = nftItemsUniqueNextIndex + nftItemsLegend.length;
    nftItemsLegendLastItem = nftItemsLegend[nftItemsLegend.length - 1];

    for(let i = nftItemsLegendNextIndex; i < nftItemRarity.length; i++) {
        if(nftItemsLegendLastItem != undefined) {
            if(nftItemRarity[i].rarityScore == nftItemsLegendLastItem.rarityScore) {
                nftItemsLegend.push(nftItemRarity[i]);
            }
        }
    }

    nftItemsLegendNextIndex = nftItemsUniqueNextIndex + nftItemsLegend.length;

    //Select Epic Nft Items and add them to the list

    for(let i = nftItemsLegendNextIndex; i < Math.floor(nftItemsLegendNextIndex + ((itemCount - nftItemsLegendNextIndex) * 8 / 100)); i++) {
        nftItemsEpic.push(nftItemRarity[i]);
    }

    nftItemsEpicNextIndex = nftItemsLegendNextIndex + nftItemsEpic.length;
    nftItemsEpicLastItem = nftItemsEpic[nftItemsEpic.length - 1];

    for(let i = nftItemsEpicNextIndex; i < nftItemRarity.length; i++) {
        if(nftItemsEpicLastItem != undefined) {
            if(nftItemRarity[i].rarityScore == nftItemsEpicLastItem.rarityScore) {
                nftItemsEpic.push(nftItemRarity[i]);
            }
        }
    }

    nftItemsEpicNextIndex = nftItemsLegendNextIndex + nftItemsEpic.length;

    //Select Rare Nft Items and add them to the list

    for(let i = nftItemsEpicNextIndex; i < Math.floor(nftItemsEpicNextIndex + ((itemCount - nftItemsEpicNextIndex) * 20 / 100)); i++) {
        nftItemsRare.push(nftItemRarity[i]);
    }

    nftItemsRareNextIndex = nftItemsEpicNextIndex + nftItemsRare.length;
    nftItemsRareLastItem = nftItemsRare[nftItemsRare.length - 1];

    for(let i = nftItemsRareNextIndex; i < nftItemRarity.length; i++) {
        if(nftItemsRareLastItem != undefined) {
            if(nftItemRarity[i].rarityScore == nftItemsRareLastItem.rarityScore) {
                nftItemsRare.push(nftItemRarity[i]);
            }       
        }
    }

    nftItemsRareNextIndex = nftItemsEpicNextIndex + nftItemsRare.length;

    //Select Common Items and add them to the list

    for(let i = nftItemsRareNextIndex; i < itemCount; i++) {
        nftItemsCommon.push(nftItemRarity[i]);
    }

    //Add all Nft Items to the updated nft rarity list

    for(let i = 0; i < nftItemsUnique.length; i++) {
        nftItemsUnique[i] = {
            index: nftItemsUnique[i].index,
            rarity: 'unique',
            rarityScore: nftItemsUnique[i].rarityScore
        };
        updatedNftItemRarity.push(nftItemsUnique[i]);
    }
    
    for(let i = 0; i < nftItemsLegend.length; i++) {
        nftItemsLegend[i] = {
            index: nftItemsLegend[i].index,
            rarity: 'legend',
            rarityScore: nftItemsLegend[i].rarityScore
        };
        updatedNftItemRarity.push(nftItemsLegend[i]);
    }
    
    for(let i = 0; i < nftItemsEpic.length; i++) {
        nftItemsEpic[i] = {
            index: nftItemsEpic[i].index,
            rarity: 'epic',
            rarityScore: nftItemsEpic[i].rarityScore
        };
        updatedNftItemRarity.push(nftItemsEpic[i]);
    }
    
    for(let i = 0; i < nftItemsRare.length; i++) {
        nftItemsRare[i] = {
            index: nftItemsRare[i].index,
            rarity: 'rare',
            rarityScore: nftItemsRare[i].rarityScore
        };
        updatedNftItemRarity.push(nftItemsRare[i]);
    }
    
    for(let i = 0; i < nftItemsCommon.length; i++) {
        nftItemsCommon[i] = {
            index: nftItemsCommon[i].index,
            rarity: 'common',
            rarityScore: nftItemsCommon[i].rarityScore
        };
        updatedNftItemRarity.push(nftItemsCommon[i]);
    }

    console.log('Unique Items: ' + nftItemsUnique.length + ', Legend Items: ' + nftItemsLegend.length + ', Epic Items: ' + nftItemsEpic.length + ', Rare Items: ' + nftItemsRare.length + ', Common Items: ' + nftItemsCommon.length);

    return updatedNftItemRarity;
}

module.exports = selectNftItemRarity; 