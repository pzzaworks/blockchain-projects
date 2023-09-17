function selectRandomIndex(fromArray, toArray, mainArray) {
    let selectedRandomIndex = Math.floor(Math.random() * fromArray.length);

    if(toArray.findIndex(item => item === fromArray[selectedRandomIndex]) == -1 && mainArray.findIndex(item => item === fromArray[selectedRandomIndex]) == -1) {
        return fromArray[selectedRandomIndex];
    } else {
        return selectRandomIndex(fromArray, toArray, mainArray);
    }
}

module.exports = selectRandomIndex;