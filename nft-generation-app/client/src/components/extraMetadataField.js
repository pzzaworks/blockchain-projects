import React from 'react';

export default function ExtraMetadataField({ extraMetadataFieldIndex, extraMetadataFields, setExtraMetadataFields }) {
    function setExtraMetadataFieldName(value) {
        let newExtraMetadataFields = [...extraMetadataFields];
        newExtraMetadataFields[extraMetadataFieldIndex].name = value;
        setExtraMetadataFields(newExtraMetadataFields);
    } 

    function setExtraMetadataFieldValue(value) {
        let newExtraMetadataFields = [...extraMetadataFields];
        newExtraMetadataFields[extraMetadataFieldIndex].value = value;
        setExtraMetadataFields(newExtraMetadataFields);
    } 

    return (
        <>
            <span>{'Extra Metadata Field ' + (extraMetadataFieldIndex + 1).toString()}</span>
            <div className='smallInputs'>
                <div>
                    <span>Name</span>
                    <input required autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setExtraMetadataFieldName(e.target.value);}} value={extraMetadataFields[extraMetadataFieldIndex].name}/>
                </div>
                <div>
                    <span>Value</span>
                    <input required autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setExtraMetadataFieldValue(e.target.value);}} value={extraMetadataFields[extraMetadataFieldIndex].value}/>
                </div>
            </div>
        </>
    )
}