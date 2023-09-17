function getRandomRarity(rarityData){
    let totalRarity = 0;
    for(let i = 0; i < rarityData.length; i++) {
        totalRarity += rarityData[i].weight;
    }

    let randomNumber = Math.random() * totalRarity;

    for(let i = 0; i < rarityData.length; i++) {
        let currentRarity = rarityData[i];
        if(randomNumber < currentRarity.weight) {
            return currentRarity.rarity;
        }
        randomNumber -= currentRarity.weight;
    }
};

module.exports = getRandomRarity;