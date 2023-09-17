const fs = require('fs-extra');
const path = require('path');

function saveDraft(result, fields) {
    let draftData = {};

    draftData['nftItemCount'] = fields.nftItemCount;
    draftData['nftItemSizeWidth'] = fields.nftItemSizeWidth;
    draftData['nftItemSizeHeight'] = fields.nftItemSizeHeight;
    draftData['pixelArtActive'] = fields.pixelArtActive;
    draftData['uniqueNftNames'] = JSON.parse(fields.uniqueNftNames);
    draftData['nftItemName'] = fields.nftItemName;
    draftData['collectionDescription'] = fields.collectionDescription;
    draftData['extraMetadataFields'] = JSON.parse(fields.extraMetadataFields);
    draftData['groups'] = JSON.parse(fields.groups);
    draftData['rounds'] = JSON.parse(fields.rounds);
    draftData['layers'] = JSON.parse(fields.layers);
    draftData['baseURI'] = fields.baseURI;
    draftData['collageImageRowCount'] = fields.collageImageRowCount;
    draftData['collageImageColumnCount'] = fields.collageImageColumnCount;
    draftData['previewNftImage'] = JSON.parse(fields.previewNftImage);
    
    fs.writeFileSync(path.join(__basedir, '/build/draft/draft.json'), JSON.stringify(draftData, null, 2));

    if(!fs.existsSync(path.join(__basedir, '/build/draft/uploads/'))) {
        fs.mkdirSync(path.join(__basedir, '/build/draft/uploads/'));
        fs.mkdirSync(path.join(__basedir, '/build/draft/uploads/layers/'));
    }

    if(fs.existsSync(path.join(__basedir, '/build/draft/uploads/layers/'))) {
        fs.copySync(path.join(__basedir, '/build/uploads/layers/'), path.join(__basedir, '/build/draft/uploads/layers/'), {recursive: true});
    }

    if(fs.existsSync(path.join(__basedir, '/build/draft/uploads/layers/'))) {
        fs.copySync(path.join(__basedir, '/build/uploads/layers/'), path.join(__basedir, '/build/draft/uploads/layers/'), {recursive: true});
    }

    if(!fs.existsSync(path.join(__basedir, '/build/draft/collageImage/'))) {
        fs.mkdirSync(path.join(__basedir, '/build/draft/collageImage/'));
    }

    if(fs.existsSync(path.join(__basedir, '/build/collageImage/collageImage.png'))) {
        fs.copySync(path.join(__basedir, '/build/collageImage/'), path.join(__basedir, '/build/draft/collageImage/'), {recursive: true});
    }

    if(!fs.existsSync(path.join(__basedir, '/build/draft/previewNftImage/'))) {
        fs.mkdirSync(path.join(__basedir, '/build/draft/previewNftImage/'));
    }

    if(fs.existsSync(path.join(__basedir, '/build/previewNftImage/previewNftImage.png'))) {
        fs.copySync(path.join(__basedir, '/build/previewNftImage/'), path.join(__basedir, '/build/draft/previewNftImage/'), {recursive: true});
    }

    result.status(200).send({
        type: 'success',
        message: 'Draft saved.'
    });
}

module.exports = saveDraft;