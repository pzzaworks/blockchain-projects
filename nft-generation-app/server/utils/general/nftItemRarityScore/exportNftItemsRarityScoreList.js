const fs = require('fs-extra');
const path = require('path');

const calculateNftItemRarityScore = require('./calculateNftItemRarityScore');
const selectNftItemRarity = require('./selectNftItemRarity');
const sortArray = require('../../general/arrayFunctions/sortArray');

function exportNftItemsRarityScoreList(roundSystemActive, nftItemCountUnique) {
    let metadataList = JSON.parse(fs.readFileSync(path.join(__basedir, '/build/nftCollection/json/_metadata.json')));

    let nftItemsRarityScoreList = [];
    let nftItemRarity = [];

    for (let i = 0; i < metadataList.length; i++) {
        nftItemRarity[i] = {
            index: i + 1,
            rarity: '',
            rarityScore: calculateNftItemRarityScore(metadataList, i)
        };
    }

    nftItemRarity = sortArray(nftItemRarity, 'rarityScore', 'decreasing');

    nftItemRarity = selectNftItemRarity(nftItemRarity, nftItemCountUnique);

    nftItemRarity.forEach((item) => {
        nftItemsRarityScoreList.push({ 'index': item.index, 'rarity': item.rarity, 'rarityScore': item.rarityScore.toFixed(2) });
    });

    if(roundSystemActive === 'true') {
        fs.writeFileSync(path.join(__basedir, '/build/nftCollection/extra/nftItemsRarityScoreListWithRounds.json'), JSON.stringify(nftItemsRarityScoreList, null, 2));
    } else {
        fs.writeFileSync(path.join(__basedir, '/build/nftCollection/extra/nftItemsRarityScoreList.json'), JSON.stringify(nftItemsRarityScoreList, null, 2));
    }
}

module.exports = exportNftItemsRarityScoreList;