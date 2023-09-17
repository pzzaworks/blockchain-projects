const fs = require('fs-extra');
const path = require('path');
const zipLib = require("zip-lib");

const sortArray  =require('../general/arrayFunctions/sortArray');
const shuffleArray = require('../general/arrayFunctions/shuffleArray');
const selectRandomIndex = require('../general/arrayFunctions/selectRandomIndex');
const exportNftItemsRarityScoreList = require('../general/nftItemRarityScore/exportNftItemsRarityScoreList');

function updateNftCollectionWithRounds(result, rounds) {
    let nftItemsRarityScoreList = JSON.parse(fs.readFileSync(path.join(__basedir, '/build/nftCollection/extra/nftItemsRarityScoreList.json')));
    
    let uniqueNftItemIndexes = nftItemsRarityScoreList.filter(item => item.rarity === 'unique');
    let legendNftItemIndexes = nftItemsRarityScoreList.filter(item => item.rarity === 'legend');
    let epicNftItemIndexes = nftItemsRarityScoreList.filter(item => item.rarity === 'epic');
    let rareNftItemIndexes = nftItemsRarityScoreList.filter(item => item.rarity === 'rare');
    let commonNftItemIndexes = nftItemsRarityScoreList.filter(item => item.rarity === 'common');

    let generatedUniqueNftItemIndexes = [];
    let generatedLegendNftItemIndexes = [];
    let generatedEpicNftItemIndexes = [];
    let generatedRareNftItemIndexes = [];
    let generatedCommonNftItemIndexes = [];

    let currentRoundGeneratedUniqueNftItemIndexes = [];
    let currentRoundGeneratedLegendNftItemIndexes = [];
    let currentRoundGeneratedEpicNftItemIndexes = [];
    let currentRoundGeneratedRareNftItemIndexes = [];
    let currentRoundGeneratedCommonNftItemIndexes = [];

    let generatedNftItemIndexes = [];
    let currentRoundGeneratedNftItemIndexes = [];

    for (let i = 1; i <= parseInt(rounds.roundCount); i++) {

        currentRoundGeneratedUniqueNftItemIndexes.length = 0;
        currentRoundGeneratedLegendNftItemIndexes.length = 0;
        currentRoundGeneratedEpicNftItemIndexes.length = 0;
        currentRoundGeneratedRareNftItemIndexes.length = 0;
        currentRoundGeneratedCommonNftItemIndexes.length = 0;
        currentRoundGeneratedNftItemIndexes.length = 0;

        for (let j = 0; j < parseInt(rounds['round' + i.toString()].unique); j++) {
            let selectedRandomIndex = selectRandomIndex(uniqueNftItemIndexes, currentRoundGeneratedUniqueNftItemIndexes, generatedUniqueNftItemIndexes);
            currentRoundGeneratedUniqueNftItemIndexes.push(selectedRandomIndex);
            generatedUniqueNftItemIndexes.push(selectedRandomIndex);
        }

        for (let j = 0; j < parseInt(rounds['round' + i.toString()].legend); j++) {
            let selectedRandomIndex = selectRandomIndex(legendNftItemIndexes, currentRoundGeneratedLegendNftItemIndexes, generatedLegendNftItemIndexes);
            currentRoundGeneratedLegendNftItemIndexes.push(selectedRandomIndex);
            generatedLegendNftItemIndexes.push(selectedRandomIndex);
        }

        for (let j = 0; j < parseInt(rounds['round' + i.toString()].epic); j++) {
            let selectedRandomIndex = selectRandomIndex(epicNftItemIndexes, currentRoundGeneratedEpicNftItemIndexes, generatedEpicNftItemIndexes);
            currentRoundGeneratedEpicNftItemIndexes.push(selectedRandomIndex);
            generatedEpicNftItemIndexes.push(selectedRandomIndex);
        }

        for (let j = 0; j < parseInt(rounds['round' + i.toString()].rare); j++) {
            let selectedRandomIndex = selectRandomIndex(rareNftItemIndexes, currentRoundGeneratedRareNftItemIndexes, generatedRareNftItemIndexes);
            currentRoundGeneratedRareNftItemIndexes.push(selectedRandomIndex);
            generatedRareNftItemIndexes.push(selectedRandomIndex);
        }

        for (let j = 0; j < parseInt(rounds['round' + i.toString()].common); j++) {
            let selectedRandomIndex = selectRandomIndex(commonNftItemIndexes, currentRoundGeneratedCommonNftItemIndexes, generatedCommonNftItemIndexes);
            currentRoundGeneratedCommonNftItemIndexes.push(selectedRandomIndex);
            generatedCommonNftItemIndexes.push(selectedRandomIndex);
        }

        for(let j = 0; j < currentRoundGeneratedUniqueNftItemIndexes.length; j++) {
            currentRoundGeneratedNftItemIndexes.push(currentRoundGeneratedUniqueNftItemIndexes[j]);
        }

        for(let j = 0; j < currentRoundGeneratedLegendNftItemIndexes.length; j++) {
            currentRoundGeneratedNftItemIndexes.push(currentRoundGeneratedLegendNftItemIndexes[j]);
        }

        for(let j = 0; j < currentRoundGeneratedEpicNftItemIndexes.length; j++) {
            currentRoundGeneratedNftItemIndexes.push(currentRoundGeneratedEpicNftItemIndexes[j]);
        }

        for(let j = 0; j < currentRoundGeneratedRareNftItemIndexes.length; j++) {
            currentRoundGeneratedNftItemIndexes.push(currentRoundGeneratedRareNftItemIndexes[j]);
        }

        for(let j = 0; j < currentRoundGeneratedCommonNftItemIndexes.length; j++) {
            currentRoundGeneratedNftItemIndexes.push(currentRoundGeneratedCommonNftItemIndexes[j]);
        }

        currentRoundGeneratedNftItemIndexes = shuffleArray(currentRoundGeneratedNftItemIndexes);

        for(let j = 0; j < currentRoundGeneratedNftItemIndexes.length; j++) {
            generatedNftItemIndexes.push(currentRoundGeneratedNftItemIndexes[j]);
        }
    }

    let metadataListWithRounds = [];

    for(let i = 0; i < generatedNftItemIndexes.length; i++) { 
        fs.copySync(path.join(__basedir, '/build/nftCollection/images/' + generatedNftItemIndexes[i].index.toString() + '.png'), path.join(__basedir, '/build/nftCollectionWithRounds/images/' + (i + 1).toString() + '.png'));
    }

    for(let i = 0; i < generatedNftItemIndexes.length; i++) { 
        fs.copySync(path.join(__basedir, '/build/nftCollection/json/' + generatedNftItemIndexes[i].index.toString() + '.json'), path.join(__basedir, '/build/nftCollectionWithRounds/json/' + (i + 1).toString() + '.json'));
    }

    for(let i = 0; i < generatedNftItemIndexes.length; i++) {
        let currentJsonFile = fs.readFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/' + (i + 1).toString() + '.json'));
        let currentJsonObject = JSON.parse(currentJsonFile);
        currentJsonObject.id = (i + 1);
        currentJsonObject.name = currentJsonObject.name.split(' #')[0] + ' #' + (i + 1).toString();
        currentJsonObject.image = currentJsonObject.image.split('/')[0] + '/' + (i + 1).toString() + '.png';
        
        fs.writeFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/' + (i + 1).toString() + '.json'), JSON.stringify(currentJsonObject, null, 2));
        metadataListWithRounds.push(currentJsonObject);
    }

    metadataListWithRounds = sortArray(metadataListWithRounds, 'id', 'increasing');

    fs.writeFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/_metadata.json'), JSON.stringify(metadataListWithRounds, null, 2));

    exportNftItemsRarityScoreList(rounds.roundSystemActive, parseInt(JSON.parse(fields.uniqueNftNames).uniqueNftNamesCount));

    const zip = new zipLib.Zip();
    zip.addFolder(path.join(__basedir, '/build/nftCollectionWithRounds/images'), 'images');
    zip.addFolder(path.join(__basedir, '/build/nftCollectionWithRounds/json'), 'json');
    zip.archive(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftCollectionWithRounds.zip')).then(function () {
        result.status(200).send({
            type: 'success',
            message: 'Nft collection successfully updated with rounds!'
        });
    });
}

module.exports = updateNftCollectionWithRounds;