const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const formidable = require('formidable');
const probeImageSize = require('probe-image-size');

const cleanNftCollectionFolders = require('../utils/generateNftCollection/cleanNftCollectionFolders/cleanNftCollectionFolders');
const uploadElementImage = require('../utils/uploadDeleteElementImage/uploadElementImage');
const deleteElementImage = require('../utils/uploadDeleteElementImage/deleteElementImage');
const generateNftCollection = require('../utils/generateNftCollection/generateNftCollection');
const nftGenerationProgress = require('../utils/generateNftCollection/nftGenerationProgress/nftGenerationProgress');
const cleanNftCollectionWithRoundsFolders = require('../utils/updateNftCollectionWithRounds/cleanNftCollectionWithRoundsFolders/cleanNftCollectionWithRoundsFolders');
const updateBaseURI = require('../utils/updateBaseURI/updateBaseURI');
const generateCollageImage = require('../utils/generateCollageImage/generateCollageImage');
const generatePreviewNftImage = require('../utils/previewNftImage/generatePreviewNftImage');
const clearPreviewNftImage = require('../utils/previewNftImage/clearPreviewNftImage');
const saveDraft = require('../utils/saveLoadClearDraft/saveDraft');
const clearDraft = require('../utils/saveLoadClearDraft/clearDraft');
const loadDraft = require('../utils/saveLoadClearDraft/loadDraft');

router.post('/uploadElementImage', (request, result) => {
    let uploadElementImageForm = new formidable.IncomingForm({
        keepExtensions: true,
        multiples: true,
        maxFileSize: 1024 * 1024 * 1024,
        uploadDir: path.join(__basedir, '/build/uploads/layers/'),
    });  

    uploadElementImageForm.parse(request, (error, fields, files) => {
        uploadElementImage(result, fields, files);
    });
})

router.post('/deleteElementImage', (request, result) => {
    let deleteElementImageForm = new formidable.IncomingForm();  

    deleteElementImageForm.parse(request, (error, fields, files) => {
        deleteElementImage(result, fields);
    });
})

router.post('/generateNftCollection', (request, result) => {
    cleanNftCollectionFolders();
    cleanNftCollectionWithRoundsFolders();

    let nftCollectionForm = new formidable.IncomingForm();  

    nftCollectionForm.parse(request, (error, fields, files) => {
        generateNftCollection(result, fields);
    });
});

router.post('/nftGenerationProgress', (request, result) => {
    let nftGenerationProgressForm = new formidable.IncomingForm();  

    nftGenerationProgressForm.parse(request, (error, fields, files) => {
        nftGenerationProgress(result, fields);
    });
});

router.post('/updateBaseURI', (request, result) => {
    let updateBaseURIForm = new formidable.IncomingForm();  

    updateBaseURIForm.parse(request, (error, fields, files) => {
        updateBaseURI(result, fields);
    });
});

router.post('/generateCollageImage', (request, result) => {
    let generateCollageImageForm = new formidable.IncomingForm();  

    generateCollageImageForm.parse(request, (error, fields, files) => {
        let metadataList;
        let imageSizeTemp;
        let imageSize;

        if(fields.roundSystemActive === 'false') {
            if(!fs.existsSync(path.join(__basedir, '/build/nftCollection/images/1.png')) || !fs.existsSync(path.join(__basedir, '/build/nftCollection/json/_metadata.json'))) {
                result.status(200).send({
                    type: 'error',
                    message: "You must to generate a nft collection first."
                });
            }
    
            imageSizeTemp = probeImageSize.sync(fs.readFileSync(path.join(__basedir, '/build/nftCollection/images/1.png')));
            imageSize = {
                width: parseInt(imageSizeTemp.width),
                height: parseInt(imageSizeTemp.height),
            }
            metadataList = JSON.parse(fs.readFileSync(path.join(__basedir, '/build/nftCollection/json/_metadata.json')));
        } else {
            if(!fs.existsSync(path.join(__basedir, '/build/nftCollectionWithRounds/images/1.png')) || !fs.existsSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/_metadata.json'))) {
                result.status(200).send({
                    type: 'error',
                    message: "You must to generate a nft collection with rounds first."
                });
            }
    
            imageSizeTemp = probeImageSize.sync(fs.readFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/images/1.png')));
            imageSize = {
                width: parseInt(imageSizeTemp.width),
                height: parseInt(imageSizeTemp.height),
            }
            metadataList = JSON.parse(fs.readFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/_metadata.json')));
        }

        generateCollageImage(result, fields, metadataList, imageSize);
    });
});

router.get('/downloadCollageImage', (request, result) => {
    result.download(path.join(__basedir, '/build/collageImage/collageImage.png'), 'collageImage.png');
});

router.get('/checkCollageImage', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/collageImage/collageImage.png'))) {
        result.status(200).send({
            type: 'success',
            message: "Collage Image downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a collage image first."
        });
    }
});

router.get('/downloadCollageImageWithRounds', (request, result) => {
    result.download(path.join(__basedir, '/build/collageImage/collageImageWithRounds.png'), 'collageImage.png');
});

router.get('/checkCollageImageWithRounds', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/collageImage/collageImageWithRounds.png'))) {
        result.status(200).send({
            type: 'success',
            message: "Nft Collection downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a collage image with rounds first."
        });
    }
});

router.post('/generatePreviewNftImage', (request, result) => {
    let generatePreviewNftImageForm = new formidable.IncomingForm();  

    generatePreviewNftImageForm.parse(request, (error, fields, files) => {
        generatePreviewNftImage(result, fields);
    });
});

router.get('/downloadNftCollection', (request, result) => {
    result.download(path.join(__basedir, '/build/nftCollection/extra/nftCollection.zip'), 'nftCollection.zip');
});

router.get('/checkNftCollection', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/nftCollection/extra/nftCollection.zip'))) {
        result.status(200).send({
            type: 'success',
            message: "Nft Collection downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a nft collection first."
        });
    }
});

router.get('/downloadNftCollectionWithRounds', (request, result) => {
    result.download(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftCollectionWithRounds.zip'), 'nftCollection.zip');
});

router.get('/checkNftCollectionWithRounds', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftCollectionWithRounds.zip'))) {
        result.status(200).send({
            type: 'success',
            message: "Nft Collection downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a nft collection with rounds first."
        });
    }
});

router.get('/downloadRarityScoreList', (request, result) => {
    result.download(path.join(__basedir, '/build/nftCollection/extra/nftItemsRarityScoreList.json'), 'nftItemsRarityScoreList.json');
});

router.get('/checkRarityScoreList', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/nftCollection/extra/nftItemsRarityScoreList.json'))) {
        result.status(200).send({
            type: 'success',
            message: "Rarity Score List downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a nft collection first."
        });
    }
});

router.get('/downloadRarityScoreListWithRounds', (request, result) => {
    result.download(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftItemsRarityScoreListWithRounds.json'), 'nftItemsRarityScoreList.json');
});

router.get('/checkRarityScoreListWithRounds', (request, result) => {
    if(fs.existsSync(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftItemsRarityScoreListWithRounds.json'))) {
        result.status(200).send({
            type: 'success',
            message: "Rarity Score List downloaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "You must to generate a nft collection with rounds first."
        });
    }
});

router.post('/clearPreviewNftImage', (request, result) => {
    clearPreviewNftImage(result);
});

router.get('/loadPreviewNftImage', (request, result) => {
    if (fs.existsSync(path.join(__basedir, '/build/previewNftImage/previewNftImage.png'))) { 
        const imageData = fs.readFileSync(path.join(__basedir, '/build/previewNftImage/previewNftImage.png')).toString('base64');
        result.send(imageData);
    } else {
        result.end();
    }
});

router.post('/saveDraft', (request, result) => {
    let saveDraftForm = new formidable.IncomingForm();  

    saveDraftForm.parse(request, (error, fields, files) => {
        saveDraft(result, fields);
    });
});

router.post('/clearDraft', (request, result) => {
    clearDraft(result);
});

router.get('/loadDraft', (request, result) => {
    loadDraft(result);
});

module.exports = router;