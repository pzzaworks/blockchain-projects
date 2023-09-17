const fs = require('fs-extra');
const path = require('path');

function createMetadataList(itemCount) {
    let metadataList = [];

    for(let i = 1; i <= itemCount; i++) {
        let currentJson = JSON.parse(fs.readFileSync(path.join(__basedir, '/build/nftCollection/json/' + i + '.json')).toString());
        metadataList.push(currentJson);
    }

    fs.writeFileSync(path.join(__basedir, '/build/nftCollection/json/_metadata.json'), JSON.stringify(metadataList, null, 2));
}

module.exports = createMetadataList;