import React from 'react';
import Layer from './layer';

export default function LayerProperties({ currentProperties, layers, setLayers, uniqueNftNames, uniqueNftNameOptions, setUniqueNftNameOptions }) {
    let currentLayer = '';

    if(currentProperties.split('layer')[1] !== undefined && currentProperties.split('layer')[1] !== 's') {
        currentLayer = 'Layer ' + currentProperties.split('layer')[1] + ' Properties';
    }

    return (
        <>
            {currentProperties.split('layer')[1] !== undefined && currentProperties.split('layer')[1] !== 's' ? (
                <>
                    <h2><i className="fa-solid fa-layer-group"></i> {currentLayer}</h2>
                    <div className='line'></div>
                    <Layer key={'layer' + parseInt(currentProperties.split('layer')[1])} layerIndex={parseInt(currentProperties.split('layer')[1]) - 1} layers={layers} setLayers={setLayers} uniqueNftNames={uniqueNftNames} uniqueNftNameOptions={uniqueNftNameOptions} setUniqueNftNameOptions={setUniqueNftNameOptions}/>
                </>
            ) : (<></>)}
        </>
    )
}