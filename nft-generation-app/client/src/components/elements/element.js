import React from 'react';
import Axios from 'axios';
import UniqueNftNameOption from '../uniqueNftNames/uniqueNftNameOption';
import GroupOption from '../groups/groupOption';

export default function Element({elementIndex, layerIndex, pushNotification, layers, setLayers, uniqueNftNames, uniqueNftNameOptions, setUniqueNftNameOptions, uniqueNftNameSystemActive, groups, groupSystemActive }) {
    function setElementName(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].name = value;
        setLayers(newLayers);
    }

    function setElementRarity(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].rarity = value;
        setLayers(newLayers);
    }
    
    function setElementUniqueNftName(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].uniqueNftName = value;
        setLayers(newLayers);

        let newUniqueNftNameOptions = [...uniqueNftNameOptions];
        for(let i=0; i < newUniqueNftNameOptions[layerIndex].elements.length; i++) {
            if(i !== elementIndex) {
                newUniqueNftNameOptions[layerIndex].elements[i] = newUniqueNftNameOptions[layerIndex].elements[i].filter(uniqueNftNameOption => uniqueNftNameOption !== value);
            }
        }
        
        newUniqueNftNameOptions[layerIndex].selectedUniqueNftNames = newUniqueNftNameOptions[layerIndex].selectedUniqueNftNames.filter(uniqueNftNameOption => uniqueNftNameOption !== value);
        setUniqueNftNameOptions(newUniqueNftNameOptions);
        console.log(newUniqueNftNameOptions);
    }

    function setElementGroup(value) {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].group = value;
        setLayers(newLayers);
    }

    function uploadElementImage(image) {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].image = 'true';
        setLayers(newLayers);

        let uploadElementImageData = new FormData();
        uploadElementImageData.append('layerIndex', layerIndex);
        uploadElementImageData.append('elementIndex', elementIndex);
        uploadElementImageData.append('image', image);
        /* for (var pair of uploadElementImageData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */
        
        Axios.post('http://localhost:4000/uploadElementImage', uploadElementImageData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    function deleteElementImage() {
        let newLayers = [...layers];
        newLayers[layerIndex].elements[elementIndex].image = 'false';
        setLayers(newLayers);
        
        document.getElementById('image').value = '';
        let deleteElementImageData = new FormData();
        deleteElementImageData.append('layerIndex', layerIndex);
        deleteElementImageData.append('elementIndex', elementIndex);
        /*for (var pair of deleteElementImageData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */

        Axios.post('http://localhost:4000/deleteElementImage', deleteElementImageData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    return (
        <>
            <span>Name</span>
            <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setElementName(e.target.value); }} value={layers[layerIndex].elements[elementIndex].name}/>
            <span>Rarity</span>
            <select onChange={(e) => { e.preventDefault(); setElementRarity(e.target.value); }} value={layers[layerIndex].elements[elementIndex].rarity}>
                <option value='common'>Common</option>
                <option value='rare'>Rare</option>
                <option value='epic'>Epic</option>
                <option value='legend'>Legend</option>
                <option value='unique'>Unique</option>
            </select>
            {uniqueNftNameSystemActive === 'true' ? (
                <>
                    <span>Unique NFT Name</span>
                    <select onChange={(e) => { e.preventDefault(); setElementUniqueNftName(e.target.value); }} value={layers[layerIndex].elements[elementIndex].uniqueNftName}>
                        <option value='none'>None</option>
                        {uniqueNftNameOptions[layerIndex].elements[elementIndex].map((uniqueNftNameOption, index) => ( <UniqueNftNameOption key={'uniqueNftNameOption' + index} uniqueNftNameOption={uniqueNftNameOption}/> ))}
                    </select>
                </>
            ) : (
                <>
                </>
            )}
            {groupSystemActive === 'true' ? (
                <>
                    <span>Group</span>
                    <select onChange={(e) => { e.preventDefault(); setElementGroup(e.target.value); }} value={layers[layerIndex].elements[elementIndex].group}>
                        <option value='none'>None</option>
                        {groups.map((group, index) => ( <GroupOption key={group + index} groupName={group}/> ))}
                    </select>
                </>
            ) : (
                <>
                </>
            )}
            <span>Image</span>
            <input className='file' type='file' id='image' name='image' accept='image/png' onChange={(e) => { e.preventDefault(); uploadElementImage(e.target.files[0]); }}></input>
            <div className='smallButtons'>
                <label className={layers[layerIndex].elements[elementIndex].image === 'true' ? 'disabledButton' : ''} htmlFor='image'><i className='fas fa-folder-open'></i> Upload</label>
                <button className={layers[layerIndex].elements[elementIndex].image === 'true' ? '' : 'disabledButton'} type='button' onClick={(e) => { e.preventDefault(); deleteElementImage(); }}><i className='fa-solid fa-trash-can'></i> Delete</button>
            </div>
            <br/>
        </>
    )
}