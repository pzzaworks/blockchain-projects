import React from 'react';

export default function LayerElementOption({ elementName, layerIndex, elementIndex }) {
    return (
        <>
            <option value={'layer' + layerIndex.toString() + 'Element' + elementIndex.toString()}>{elementName}</option>
        </>
    )
}