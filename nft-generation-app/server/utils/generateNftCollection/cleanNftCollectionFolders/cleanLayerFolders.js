const fs = require('fs-extra');
const path = require('path');

function cleanLayerFolders(){
    if (fs.existsSync(path.join(__basedir, '/build/uploads/layers/'))) {
        fs.rmSync(path.join(__basedir, '/build/uploads/layers/'), { recursive: true });
        fs.mkdirSync(path.join(__basedir, '/build/uploads/layers/'));
    }
};

module.exports = cleanLayerFolders;