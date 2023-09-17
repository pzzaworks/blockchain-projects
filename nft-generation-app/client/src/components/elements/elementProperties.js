import React from 'react';
import Element from './element';

export default function ElementProperties({ pushNotification, currentSubMenu, currentProperties, layers, setLayers, uniqueNftNames, uniqueNftNameOptions, setUniqueNftNameOptions, uniqueNftNameSystemActive, groups, groupSystemActive }) {
    let currentElement = '';
    let layerIndex;

    if(currentSubMenu.split('layer')[1] !== undefined && currentSubMenu.split('layer')[1] !== 's') {
        layerIndex = currentSubMenu.split('layer')[1];
    }

    if(currentProperties.split('element')[1] !== undefined) {
        currentElement = 'Element ' + currentProperties.split('element')[1] + ' Properties';
    }
    
    return (
        <>
            {currentProperties.split('element')[1] !== undefined ? (
                <>
                    <h2><i className="fa-solid fa-layer-group"></i> {currentElement}</h2>
                    <div className='line'></div>
                    { <Element elementIndex={parseInt(currentProperties.split('element')[1]) - 1} layerIndex={parseInt(layerIndex) - 1} pushNotification={pushNotification} layers={layers} setLayers={setLayers} uniqueNftNames={uniqueNftNames} uniqueNftNameOptions={uniqueNftNameOptions} setUniqueNftNameOptions={setUniqueNftNameOptions} uniqueNftNameSystemActive={uniqueNftNameSystemActive} groups={groups} groupSystemActive={groupSystemActive}/> }
                </>
            ) : (<></>)}
        </>
    )
}