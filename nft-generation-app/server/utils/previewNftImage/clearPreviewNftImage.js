const fs = require('fs-extra');
const path = require('path');

function clearPreviewNftImage(result) {
    if (fs.existsSync(path.join(__basedir, '/build/previewNftImage/'))) { 
        fs.rmSync(path.join(__basedir, '/build/previewNftImage/'), { recursive: true });
        fs.mkdirSync(path.join(__basedir, '/build/previewNftImage/'));

        result.status(200).send({
            type: 'success',
            message: 'Preview Nft image cleared.'
        });
    } else {
        result.status(200).send({
            type: 'error',
            message: "Preview Nft image doesn't exist."
        });
    }
}

module.exports = clearPreviewNftImage;