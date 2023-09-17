import React from 'react';
import LayerElementOption from './layerElementOption';

export default function LayerElementSelect({ layers, layerIndex, previewNftImageLayerElements, setPreviewNftImageLayerElements }) {

    function setPreviewNftImageLayerElement(value){
        let newPreviewNftImageLayerElements = [...previewNftImageLayerElements];
        newPreviewNftImageLayerElements[layerIndex] = value;
        setPreviewNftImageLayerElements(newPreviewNftImageLayerElements);
    }

    return (
        <>
            <span>Layer {(layerIndex + 1).toString()} Element</span>
            <select onChange={(e) => { e.preventDefault(); setPreviewNftImageLayerElement(e.target.value);}} value={previewNftImageLayerElements[layerIndex]}>
                <option value='none'>None</option>
                {layers[layerIndex].elements.map(({name}, index) => ( <LayerElementOption key={'element' + index} elementName={name} layerIndex={layerIndex + 1} elementIndex={index + 1}/> ))}
            </select>
        </>
    )
}