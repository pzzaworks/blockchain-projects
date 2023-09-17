const fs = require('fs-extra');
const path = require('path');

function cleanNftCollectionWithRoundsFolders(){
    if (fs.existsSync(path.join(__basedir, '/build/nftCollectionWithRounds/'))) {
        fs.rmSync(path.join(__basedir, '/build/nftCollectionWithRounds/'), { recursive: true });
        fs.mkdirSync(path.join(__basedir, '/build/nftCollectionWithRounds'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollectionWithRounds/images'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollectionWithRounds/json'));
        fs.mkdirSync(path.join(__basedir, '/build/nftCollectionWithRounds/extra'));
    }
};

module.exports = cleanNftCollectionWithRoundsFolders;