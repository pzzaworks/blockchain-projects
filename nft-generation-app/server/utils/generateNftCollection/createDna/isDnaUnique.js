function isDnaUnique(dnaList, newDna) {
    let foundDna = dnaList.find((dna) => dna.join('') === newDna.join(''));
    return foundDna == undefined ? true : false;
};

module.exports = isDnaUnique;