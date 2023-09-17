const fs = require('fs-extra');
const path = require('path');

function cleanNftCollectionFolders(){
    if (fs.existsSync(path.join(__basedir, '../client/public/downloads/'))) {
        fs.rmSync(path.join(__basedir, '../client/public/downloads/'), { recursive: true });
        fs.mkdirSync(path.join(__basedir, '../client/public/downloads/'));
    }
    
    if (fs.existsSync(path.join(__basedir, '/build/nftCollection/'))) {
        fs.rmSync(path.join(__basedir, '/build/nftCollection/'), {
            recursive: true
        });
        fs.mkdirSync(path.join(__basedir, '/build/nftCollection/'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollection/images'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollection/json'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollection/extra'));
    }
};

module.exports = cleanNftCollectionFolders;