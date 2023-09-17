const fs = require('fs-extra');
const path = require('path');

function clearDraft(result) {
    if (fs.existsSync(path.join(__basedir, '/build/draft/'))) { 
        fs.rmSync(path.join(__basedir, '/build/draft/'), { recursive: true });
        fs.mkdirSync(path.join(__basedir, '/build/draft/'));

        result.status(200).send({
            type: "success",
            message: "Draft cleared."
        });
    } else {
        result.status(200).send({
            type: "error",
            message: "Draft doesn't exist."
        });
    }
}

module.exports = clearDraft;