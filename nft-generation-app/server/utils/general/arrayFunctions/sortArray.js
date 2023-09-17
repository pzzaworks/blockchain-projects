function sortArray(array, property, setting) {
    if(setting == 'increasing'){
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array.length - i - 1; j++) {
                if(array[j][property] > array[j + 1][property]) {
                    let temp = array[j]
                    array[j] = array[j + 1]
                    array[j + 1] = temp
                }
            }
        }
    } else if(setting == 'decreasing') {
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array.length - i - 1; j++) {
                if(array[j][property] < array[j + 1][property]) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;        
                }
            }
        }
    }

    return array;
}

module.exports = sortArray;