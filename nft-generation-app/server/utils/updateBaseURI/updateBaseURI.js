const fs = require('fs-extra');
const path = require('path');
const zipLib = require("zip-lib");

function updateBaseURI(result, fields) {
    if(fields.roundSystemActive === 'false') {
        if(!fs.existsSync(path.join(__basedir,  '/build/nftCollection/json/_metadata.json'))) {
            result.status(200).send({
                type: 'error',
                message: "You must to generate a nft collection first."
            });
        }

        let metadataList = JSON.parse(fs.readFileSync(path.join(__basedir,  '/build/nftCollection/json/_metadata.json')));
        
        metadataList.forEach((item) => {
            item.image = fields.baseURI + '/' + item.id + '.png';
            fs.writeFileSync(path.join(__basedir, '/build/nftCollection/json/' + item.id + '.json'), JSON.stringify(item, null, 2));
        });
    
        fs.writeFileSync(path.join(__basedir, '/build/nftCollection/json/_metadata.json'), JSON.stringify(metadataList, null, 2));

        const zip = new zipLib.Zip();
        zip.addFolder(path.join(__basedir, '/build/nftCollection/images'), 'images');
        zip.addFolder(path.join(__basedir, '/build/nftCollection/json'), 'json');
        zip.archive(path.join(__basedir, '/build/nftCollection/extra/nftCollection.zip'));
        zip.archive(path.join(__basedir, '../client/public/downloads/nftCollection.zip')).then(function () {
            result.status(200).send({
                type: 'success',
                data: draftData,
                message: "All metadata successfully updated."
            });
        });

    } else {
        if(!fs.existsSync(path.join(__basedir,  '/build/nftCollectionWithRounds/json/_metadata.json'))) {
            result.status(200).send({
                type: 'error',
                message: "You must to generate a nft collection first."
            });
        }

        let metadataListWithRounds = JSON.parse(fs.readFileSync(path.join(__basedir,  '/build/nftCollectionWithRounds/json/_metadata.json')));

        metadataListWithRounds.forEach((item) => {
            item.image = fields.baseURI + '/' + item.id + '.png';
            fs.writeFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/' + item.id + '.json'), JSON.stringify(item, null, 2));
        });
    
        fs.writeFileSync(path.join(__basedir, '/build/nftCollectionWithRounds/json/_metadata.json'), JSON.stringify(metadataList, null, 2));
        
        const zip = new zipLib.Zip();
        zip.addFolder(path.join(__basedir, '/build/nftCollectionWithRounds/images'), 'images');
        zip.addFolder(path.join(__basedir, '/build/nftCollectionWithRounds/json'), 'json');
        zip.archive(path.join(__basedir, '/build/nftCollectionWithRounds/extra/nftCollectionWithRounds.zip'));
        zip.archive(path.join(__basedir, '../client/public/downloads/nftCollectionWithRounds.zip')).then(function () {
            result.status(200).send({
                type: 'success',
                message: "All metadata successfully updated."
            });
        });
    }
}

module.exports = updateBaseURI;