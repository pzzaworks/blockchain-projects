import React from 'react';
import { HexColorPicker } from "react-colorful";

export default function Layer({ layerIndex, layers, setLayers, uniqueNftNames, uniqueNftNameOptions, setUniqueNftNameOptions }) {
    function setLayerName(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].name = value;
        setLayers(newLayers);
    }

    function setLayerType(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].type = value;
        if(value === 'text') {
            newLayers[layerIndex].elements = [];
        }
        setLayers(newLayers);
    }

    function setLayerEffect(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].effect = value;
        setLayers(newLayers);
    }

    function setLayerFont(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].font = value;
        setLayers(newLayers);
    }

    function setLayerSize(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].size = value;
        setLayers(newLayers);
    }

    function setLayerColor(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].color = value;
        setLayers(newLayers);
    }

    function setLayerText(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].text = value;
        setLayers(newLayers);
    }

    function setLayerCounter(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].counter = value;
        setLayers(newLayers);
    }

    function setLayerPosition(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].position = value;
        setLayers(newLayers);
    }

    function setLayerPositionPadding(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].positionPadding = value;
        setLayers(newLayers);
    }

    function addNewElement(){
        let newLayers = [...layers];
        newLayers[layerIndex].elements.push({ name: '', rarity: 'common', uniqueNftName: '', group: '', image: 'false'});
        setLayers(newLayers);

        let newUniqueNftNameOptions = [...uniqueNftNameOptions];
        newUniqueNftNameOptions[layerIndex].elements.push(newUniqueNftNameOptions[layerIndex].selectedUniqueNftNames);
        setUniqueNftNameOptions(newUniqueNftNameOptions);
    }

    function removeLastElement(){
        if(layers[layerIndex].elements.length > 0) {
            let newLayers = [...layers];
            newLayers[layerIndex].elements.pop();
            setLayers(newLayers);
            
            let newUniqueNftNameOptions = [...uniqueNftNameOptions];
            newUniqueNftNameOptions[layerIndex].elements.pop();
            setUniqueNftNameOptions(newUniqueNftNameOptions);
        }
    }
    
    return (
        <div className='contentRow'>
            <span>Name</span>
            <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setLayerName(e.target.value); }} value={layers[layerIndex].name}/>
            <span>Type</span>
            <select onChange={(e) => { e.preventDefault(); setLayerType(e.target.value); }} value={layers[layerIndex].type}>
                <option value='image'>Image</option>
                <option value='text'>Text</option>
            </select>
            <span>Effect</span>
            <select onChange={(e) => { e.preventDefault(); setLayerEffect(e.target.value); }} value={layers[layerIndex].effect}>
                <option value='source-over'>Default</option>
                <option value='color'>Color</option>
                <option value='darken'>Darken</option>
                <option value='difference'>Difference</option>
                <option value='exclusion'>Exclusion</option>
                <option value='hard-light'>Hard Light</option>
                <option value='hue'>Hue</option>
                <option value='lighten'>Lighten</option>
                <option value='luminosity'>Luminosity</option>
                <option value='multiply'>Multiply</option>
                <option value='overlay'>Overlay</option>
                <option value='saturation'>Saturation</option>
                <option value='screen'>Screen</option>
                <option value='soft-light'>Soft Light</option>
            </select>
            <div className='contentRow'>
                {layers[layerIndex].type === 'image' ? (
                    <>
                        <span>Elements</span>
                        <div className='smallButtons'>
                            <button type='button' onClick={(e) => { e.preventDefault(); addNewElement(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                            <button type='button' onClick={(e) => { e.preventDefault(); removeLastElement(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                        </div>
                    </>
                ) : (<></>)}
                {layers[layerIndex].type === 'text' ? (
                    <>
                        <span>Font</span>
                        <select onChange={(e) => { e.preventDefault(); setLayerFont(e.target.value); }} value={layers[layerIndex].font}>
                            <option value='Inter'>Inter</option>
                            <option value='Averia Sans Libre'>Averia Sans Libre</option>
                        </select>
                        <span>Size (pt)</span>
                        <input autoComplete='off' type='number' min='1' onChange={(e) => { e.preventDefault(); setLayerSize(e.target.value); }} value={layers[layerIndex].size}/>
                        <span>Color (hex)</span>
                        <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setLayerColor(e.target.value); }} value={layers[layerIndex].color}/>
                        <HexColorPicker color={layers[layerIndex].color} onChange={setLayerColor} />
                        <span>Text</span>
                        <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setLayerText(e.target.value); }} value={layers[layerIndex].text}/>
                        <span>Add A Counter</span>
                        <select onChange={(e) => { e.preventDefault(); setLayerCounter(e.target.value); }} value={layers[layerIndex].counter}>
                            <option value='true'>True</option>
                            <option value='false'>False</option>
                        </select>
                        <span>Position</span>
                        <select onChange={(e) => { e.preventDefault(); setLayerPosition(e.target.value); }} value={layers[layerIndex].position}>
                            <option value='topLeft'>Top Left</option>
                            <option value='topCenter'>Top Center</option>
                            <option value='topRight'>Top Right</option>
                            <option value='left'>Left</option>
                            <option value='center'>Center</option>
                            <option value='right'>Right</option>
                            <option value='bottomLeft'>Bottom Left</option>
                            <option value='bottomCenter'>Bottom Center</option>
                            <option value='bottomRight'>Bottom Right</option>
                        </select>
                        <span>Position Padding (px)</span>
                        <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setLayerPositionPadding(e.target.value); }} value={layers[layerIndex].positionPadding}/>
                    </>
                ) : (<></>)}
            </div>
        </div>
    )
}