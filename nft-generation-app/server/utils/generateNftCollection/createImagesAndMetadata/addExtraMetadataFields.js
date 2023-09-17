function addExtraMetadataFields(extraMetadataFields) {
    let tempMetadataExtraMetadataFields = {};

    for(let i = 0; i < extraMetadataFields.extraMetadataFieldsCount; i++) {
        
        if(extraMetadataFields.extraMetadataFields[i].name != '' && extraMetadataFields.extraMetadataFields[i].value != ''){
            let currentExtraMetadataField = {};
            currentExtraMetadataField[extraMetadataFields.extraMetadataFields[i].name.toLowerCase()] = extraMetadataFields.extraMetadataFields[i].value;
            tempMetadataExtraMetadataFields = Object.assign(tempMetadataExtraMetadataFields, currentExtraMetadataField);
        }
    }

    return tempMetadataExtraMetadataFields;
};

module.exports = addExtraMetadataFields;