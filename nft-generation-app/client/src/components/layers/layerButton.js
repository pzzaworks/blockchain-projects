import React from 'react';

export default function LayerButton({ layerIndex, currentSubMenu, setCurrentSubMenu }) {
    let currentLayer = 'Layer ' + layerIndex.toString();
    let currentSubMenuLayer = 'layer' + layerIndex.toString();

    return (
        <>
            <button className={currentSubMenu === currentSubMenuLayer ? 'activatedSubLeftBarDivButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentSubMenu(currentSubMenuLayer);}}>
                <span>{currentLayer}</span>
            </button>
        </>
    )
}