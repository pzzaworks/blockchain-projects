const fs = require('fs-extra');
const path = require('path');
const zipLib = require("zip-lib");

const createLayers = require('./createLayers/createLayers');
const createDna = require('./createDna/createDna');
const isDnaUnique = require('./createDna/isDnaUnique');
const createDnaLayers = require('./createDna/createDnaLayers');
const createImagesAndMetadata = require('./createImagesAndMetadata/createImagesAndMetadata');
const loadLayerImage = require('./createImagesAndMetadata/loadLayerImage');
const createMetadataList = require('./createImagesAndMetadata/createMetadataList');
const exportNftItemsRarityScoreList = require('../general/nftItemRarityScore/exportNftItemsRarityScoreList');
const updateNftCollectionWithRounds = require('../../utils/updateNftCollectionWithRounds/updateNftCollectionWithRounds');
const cleanLayerFolders = require('./cleanNftCollectionFolders/cleanLayerFolders');

async function generateNftCollection(result, fields){
    try{
        let layerIndexes = [];
        let itemIndexes = [];
        let generatedUniqueNftNames = [];
    
        let generatedItemCount = 1;
        let failedItemCount = 0;
    
        let dnaList = [];
    
        for (let i = 1; i <= parseInt(JSON.parse(fields.layers).layerCount); i++) { layerIndexes.push(i);}
        for (let j = 1; j <= parseInt(fields.nftItemCount); j++) { itemIndexes.push(j);}
        
        const layers = createLayers(result, layerIndexes, fields);
    
        while (generatedItemCount <= parseInt(fields.nftItemCount)) {
            let newDna = createDna(result, fields, layers, generatedUniqueNftNames);
            
            if (isDnaUnique(dnaList, newDna)) {
                let results = createDnaLayers(newDna, layers);
                let loadedElements = [];
    
                results.forEach((layer) => {
                    if(layer.type === 'image') {
                        loadedElements.push(loadLayerImage(layer));
                    } else {
                        loadedElements.push({ layer: layer });
                    }
                });

                await Promise.all(loadedElements).then((renderObjectArray) => {
                    generatedUniqueNftNames.push(renderObjectArray[0].layer.selectedElement.uniqueNftName);
                    createImagesAndMetadata(fields, renderObjectArray, itemIndexes, newDna);
                });
    
                console.log('Generated Item Index: ' + generatedItemCount + ' - Item Dna: ' + newDna);
                
                dnaList.push(newDna);
                generatedItemCount++;
                itemIndexes.shift();
            } else {
                failedItemCount++;
                if (failedItemCount >= parseInt(fields.nftItemCount) * parseInt(fields.nftItemCount)) {
                    result.status(200).send({
                        type: 'error',
                        message: 'You need more layers or elements to generate nft collection with this item count.'
                    });
                }
            }
        }
    
        createMetadataList(parseInt(fields.nftItemCount));
    
        exportNftItemsRarityScoreList(JSON.parse(fields.rounds).roundSystemActive, JSON.parse(fields.uniqueNftNames).uniqueNftNamesCount);
    
        if(JSON.parse(fields.rounds).roundSystemActive === 'true') {
            updateNftCollectionWithRounds(JSON.parse(fields.rounds));
        } else {
            const zip = new zipLib.Zip();
            zip.addFolder(path.join(__basedir, '/build/nftCollection/images'), 'images');
            zip.addFolder(path.join(__basedir, '/build/nftCollection/json'), 'json');
            zip.archive(path.join(__basedir, '/build/nftCollection/extra/nftCollection.zip')).then(function () {
                result.status(200).send({
                    type: 'success',
                    message: 'Nft collection successfully generated.'
                });
            });
        }
    
        cleanLayerFolders();
    } catch (error) {}
};

module.exports = generateNftCollection;