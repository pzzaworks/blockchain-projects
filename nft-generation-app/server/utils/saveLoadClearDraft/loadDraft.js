const fs = require('fs-extra');
const path = require('path');
const cleanLayerFolders = require('../generateNftCollection/cleanNftCollectionFolders/cleanLayerFolders');

function loadDraft(result) {
    if (fs.existsSync(path.join(__basedir, '/build/draft/draft.json'))) { 
        const draftFile = fs.readFileSync(path.join(__basedir, '/build/draft/draft.json'));
        let draftData = JSON.parse(draftFile);
        cleanLayerFolders();
        
        if(fs.existsSync(path.join(__basedir, '/build/draft/uploads/layers/')) && fs.existsSync(path.join(__basedir, '/build/uploads/layers/'))) {
            fs.copySync(path.join(__basedir, '/build/draft/uploads/layers/'), path.join(__basedir, '/build/uploads/layers/'), {recursive: true});
        }
        
        if(fs.existsSync(path.join(__basedir, '/build/draft/collageImage/')) && fs.existsSync(path.join(__basedir, '/build/collageImage/'))) {
            fs.copySync(path.join(__basedir, '/build/draft/collageImage/'), path.join(__basedir, '/build/collageImage/'), {recursive: true});
        }
        
        if(fs.existsSync(path.join(__basedir, '/build/draft/previewImage/')) && fs.existsSync(path.join(__basedir, '/build/previewImage/'))) {
            fs.copySync(path.join(__basedir, '/build/draft/previewImage/'), path.join(__basedir, '/build/previewImage/'), {recursive: true});
        }

        result.status(200).send({
            type: 'success',
            data: draftData,
            message: "Draft loaded successfully."
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "Draft doesn't exist."
        });
    }
}

module.exports = loadDraft;