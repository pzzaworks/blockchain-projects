const calculateNftItemRarityScore = (metadataList, nftItemIndex) => {
    let traitRarities = [];
    for (let i = 0; i < metadataList[nftItemIndex].attributes.length; i++) {
        let traitRarityScore = 0;
        let traitItems = [];

        traitItems = metadataList.filter(function(item) {
            if (item.attributes[i] != undefined){
                if (item.attributes[i].value === metadataList[nftItemIndex].attributes[i].value){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });

        traitRarityScore = 1 / (traitItems.length / (metadataList.length));
        traitRarities.push(traitRarityScore);
    }

    let nftItemRarityScore = 0;
    for (let i = 0; i < traitRarities.length; i++) {
        nftItemRarityScore += traitRarities[i];
    }

    return nftItemRarityScore;
};

module.exports = calculateNftItemRarityScore;