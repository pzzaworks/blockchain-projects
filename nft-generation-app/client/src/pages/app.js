import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';

import ExtraMetadataField from '../components/extraMetadataField';
import GroupName from '../components/groups/groupName';
import RoundButton from '../components/rounds/roundButton';
import RoundProperties from '../components/rounds/roundProperties';
import UniqueNftName from '../components/uniqueNftNames/uniqueNftName';
import LayerButton from '../components/layers/layerButton';
import LayerProperties from '../components/layers/layerProperties';
import LayerElementSelect from '../components/layers/layerElementSelect';
import ElementsButton from '../components/elements/elementsButton';
import ElementProperties from '../components/elements/elementProperties';
import Notification from '../components/notification/notification';
import ProgressBar from '../components/progressBar/progressBar';

export default function App() {

    // Notifications -------------------------------------------------- 

    const [notifications, setNotifications] = useState([]);

    const pushNotification = useCallback((type, message) => {
        let newNotifications = [...notifications];
        newNotifications.push({ index: notifications.length + 1, type: type, message: message });
        setNotifications(newNotifications);
    }, [notifications, setNotifications]);

    // Nft --------------------------------------------------

    const [nftItemCount, setNftItemCount] = useState(10000);
    const [nftItemSizeWidth, setNftItemSizeWidth] = useState(1080);
    const [nftItemSizeHeight, setNftItemSizeHeight] = useState(1080);
    const [pixelArtActive, setPixelArtActive] = useState('false');
    const [uniqueNftNameSystemActive, setUniqueNftNameSystemActive] = useState('false');
    const [roundSystemActive, setRoundSystemActive] = useState('false');
    const [groupSystemActive, setGroupSystemActive] = useState('false');

    // Metadata --------------------------------------------------

    const [nftItemName, setNftItemName] = useState('Nft Item Name');
    const [collectionDescription, setCollectionDescription] = useState('Collection Description');
    
    // Extra Metadata Fields --------------------------------------------------

    const [extraMetadataFields, setExtraMetadataFields] = useState([]);
    const [extraMetadataFieldsIndex, setExtraMetadataFieldsIndex] = useState(0);

    function addNewExtraMetadataField(){
        let newExtraMetadataFields = [...extraMetadataFields];
        setExtraMetadataFieldsIndex(extraMetadataFieldsIndex + 1);
        newExtraMetadataFields.push({ name: '', value: '' });
        setExtraMetadataFields(newExtraMetadataFields);
    }

    function removeLastExtraMetadataField(){
        if(extraMetadataFieldsIndex > 0) {
            setExtraMetadataFieldsIndex(extraMetadataFieldsIndex - 1);
            let newExtraMetadataFields = [...extraMetadataFields];
            newExtraMetadataFields.pop();
            setExtraMetadataFields(newExtraMetadataFields);
        }
    }

    // Layers --------------------------------------------------

    const [layers, setLayers] = useState([]);
    const [layersIndex, setLayersIndex] = useState(0);
    const [currentLayer, setCurrentLayer] = useState();
    
    function addNewLayer(){
        let newLayersIndex = layersIndex + 1;
        setLayersIndex(newLayersIndex);
        setLayers(layers => [...layers, { name: '', type: 'image', effect: 'source-over', font: 'Inter', size: 16, color: '#0f45ff', text: '', counter: 'false', position:'topLeft', positionPadding: '', elements: []}]);
    
        let newUniqueNftNameOptions = [...uniqueNftNameOptions];
        newUniqueNftNameOptions.push({ selectedUniqueNftNames: [], elements: [] });
        setUniqueNftNameOptions(newUniqueNftNameOptions);
    }

    function removeLastLayer(){
        if(layersIndex > 0) {
            setLayersIndex(layersIndex - 1);

            let newLayers = [...layers];
            newLayers.pop();
            setLayers(newLayers);

            let newUniqueNftNameOptions = [...uniqueNftNameOptions];
            newUniqueNftNameOptions.pop();
            setUniqueNftNameOptions(newUniqueNftNameOptions);
        }
    }

    // Unique Nft Names --------------------------------------------------
    
    const [uniqueNftNames, setUniqueNftNames] = useState([]);
    const [uniqueNftNameOptions, setUniqueNftNameOptions] = useState([]);
    const [uniqueNftNamesIndex, setUniqueNftNamesIndex] = useState(0);
    const [currentUniqueNftName, setCurrentUniqueNftName] = useState('');

    function addNewUniqueNftName(){
        if(currentUniqueNftName !== '' && uniqueNftNames.findIndex(uniqueNftName => uniqueNftName === currentUniqueNftName) === -1){
            setUniqueNftNamesIndex(uniqueNftNamesIndex + 1);
            setUniqueNftNames(uniqueNftNames => [...uniqueNftNames, currentUniqueNftName]);
           
            let newUniqueNftNameOptions = [...uniqueNftNameOptions];
            for(let i=0; i < layers.length; i++) {
                for(let j=0; j < layers[i].elements.length; j++) {
                    if(newUniqueNftNameOptions[i].elements[j] !== undefined) {
                        newUniqueNftNameOptions[i].elements[j].push(currentUniqueNftName);
                    }
                }            
                if(newUniqueNftNameOptions[i].selectedUniqueNftNames !== undefined) {
                    newUniqueNftNameOptions[i].selectedUniqueNftNames.push(currentUniqueNftName);
                }
            }
            setUniqueNftNameOptions(newUniqueNftNameOptions);

            setCurrentUniqueNftName('');
            console.log(newUniqueNftNameOptions);
        }
    }

    function removeLastUniqueNftName(){
        if(uniqueNftNamesIndex > 0){
            setUniqueNftNamesIndex(uniqueNftNamesIndex - 1);
            let newUniqueNftNames = [...uniqueNftNames];

            let newUniqueNftNameOptions = [...uniqueNftNameOptions];
            for(let i=0; i < layers.length; i++) {
                for(let j=0; j < layers[i].elements.length; j++) {
                    if(newUniqueNftNameOptions[i].elements[j] !== undefined) {
                        newUniqueNftNameOptions[i].elements[j] = newUniqueNftNameOptions[i].elements[j].filter(uniqueNftNameOption => uniqueNftNameOption !== newUniqueNftNames[newUniqueNftNames.length - 1]);
                    }   
                }       
                if(newUniqueNftNameOptions[i].selectedUniqueNftNames !== undefined) {
                    newUniqueNftNameOptions[i].selectedUniqueNftNames = newUniqueNftNameOptions[i].selectedUniqueNftNames.filter(uniqueNftNameOption => uniqueNftNameOption !== newUniqueNftNames[newUniqueNftNames.length - 1]);
                }
            }
            setUniqueNftNameOptions(newUniqueNftNameOptions);
            
            newUniqueNftNames.pop();
            setUniqueNftNames(newUniqueNftNames);
        }
    }

    // Groups --------------------------------------------------

    const [groups, setGroups] = useState([]);
    const [groupsIndex, setGroupsIndex] = useState(0);
    const [groupsAttributeName, setGroupsAttributeName] = useState('')
    const [currentGroupName, setCurrentGroupName] = useState('')
    
    function addNewGroup(){
        if(currentGroupName !== '' && groups.length === 0){
            setGroupsIndex(groupsIndex + 1);
            setGroups(groups => [...groups, currentGroupName]);
            setCurrentGroupName('');
        } else if(currentGroupName !== '' && groups.findIndex(group => group === currentGroupName) === -1){
            setGroupsIndex(groupsIndex + 1);
            setGroups(groups => [...groups, currentGroupName]);
            setCurrentGroupName('');
        }
    }

    function removeLastGroup(){
        if(groupsIndex > 0){
            setGroupsIndex(groupsIndex - 1);
            let newGroups = [...groups];
            newGroups.pop();
            setGroups(newGroups);
        }
    }

    // Rounds --------------------------------------------------

    const [rounds, setRounds] = useState([]);
    const [roundsIndex, setRoundsIndex] = useState(0);

    function addNewRound(){
        let newRoundsIndex = roundsIndex + 1;
        setRoundsIndex(newRoundsIndex);
        setRounds(rounds => [...rounds, { unique: 0, legend: 0, epic: 0, rare: 0, common: 0 }]);
    }

    function removeLastRound(){
        if(roundsIndex > 0){
            setRoundsIndex(roundsIndex - 1);
            let newRounds = [...rounds];
            newRounds.pop();
            setRounds(newRounds);
        }
    }

    // Base URI -------------------------------------------------- 

    const [baseURI, setBaseURI] = useState('https://ipfs.io/ipfs/...');

    function updateBaseURI() {
        let baseURIData = new FormData();
        baseURIData.append('baseURI', baseURI);
        baseURIData.append('roundSystemActive', roundSystemActive);
        /* for (var pair of baseURIData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */

        Axios.post('http://localhost:4000/updateBaseURI', baseURIData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    // Nft Collection -------------------------------------------------- 

    function generateNftCollection() {
        let nftCollectionData = new FormData();
        nftCollectionData.append('nftItemCount', nftItemCount);
        nftCollectionData.append('nftItemSizeWidth', nftItemSizeWidth);
        nftCollectionData.append('nftItemSizeHeight', nftItemSizeHeight);
        nftCollectionData.append('pixelArtActive', pixelArtActive);
        let uniqueNftNamesObject = { uniqueNftNameSystemActive: uniqueNftNameSystemActive, uniqueNftNamesCount: uniqueNftNames.length, uniqueNftNames: uniqueNftNames };
        nftCollectionData.append('uniqueNftNames', JSON.stringify(uniqueNftNamesObject));
        nftCollectionData.append('nftItemName', nftItemName);
        nftCollectionData.append('collectionDescription', collectionDescription);
        let extraMetadataFieldsObject = { extraMetadataFieldsCount: extraMetadataFields.length, extraMetadataFields: extraMetadataFields };
        nftCollectionData.append('extraMetadataFields', JSON.stringify(extraMetadataFieldsObject));
        let groupsObject = { groupSystemActive: groupSystemActive, groupCount: groups.length, groupsAttributeName: groupsAttributeName, groups: groups };
        nftCollectionData.append('groups', JSON.stringify(groupsObject));
        let roundsObject = { roundSystemActive: roundSystemActive, roundCount: rounds.length, rounds: rounds };
        nftCollectionData.append('rounds', JSON.stringify(roundsObject));
        let layersObject = { layerCount: layers.length, layers: layers };
        nftCollectionData.append('layers', JSON.stringify(layersObject));
        nftCollectionData.append('baseURI', baseURI);
        /* for (var pair of nftCollectionData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */

        Axios.post('http://localhost:4000/generateNftCollection', nftCollectionData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });

        nftGenerationProgress();
    }

    function downloadNftCollection() {
        if(roundSystemActive === 'false') {
            Axios.get('http://localhost:4000/checkNftCollection').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadNftCollection', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'nftCollection.zip');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        } else {
            Axios.get('http://localhost:4000/checkNftCollectionWithRounds').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadNftCollectionWithRounds', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'nftCollection.zip');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        }
    }

    function downloadRarityScoreList() {
        if(roundSystemActive === 'false') {
            Axios.get('http://localhost:4000/checkRarityScoreList').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadRarityScoreList', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'nftItemsRarityScoreList.json');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        } else {
            Axios.get('http://localhost:4000/checkRarityScoreListWithRounds').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadRarityScoreListWithRounds', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'nftItemsRarityScoreList.json');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        }
    }

    // Collage Image -------------------------------------------------- 

    const [collageImageRowCount, setCollageImageRowCount] = useState(2);
    const [collageImageColumnCount, setCollageImageColumnCount] = useState(2);

    function generateCollageImage() {
        let collageImageData = new FormData();
        collageImageData.append('collageImageRowCount', collageImageRowCount);
        collageImageData.append('collageImageColumnCount', collageImageColumnCount);
        collageImageData.append('pixelArtActive', pixelArtActive);
        collageImageData.append('roundSystemActive', roundSystemActive);
        /* for (var pair of collageImageData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */ 

        Axios.post('http://localhost:4000/generateCollageImage', collageImageData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    function downloadCollageImage() {
        if(roundSystemActive === 'false') {
            Axios.get('http://localhost:4000/checkCollageImage').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadCollageImage', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'collageImage.png');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        } else {
            Axios.get('http://localhost:4000/checkCollageImageWithRounds').then(function (response) {
                if(response.data.type === 'success') {
                    pushNotification('success', response.data.message);
                    Axios.get('http://localhost:4000/downloadCollageImageWithRounds', { responseType: 'blob' }).then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'collageImage.png');
                        document.body.appendChild(link);
                        link.click();
                    });
                } else if(response.data.type === 'error') {
                    pushNotification('error', response.data.message);
                }
            });
        }
    }

    // Preview Nft -------------------------------------------------- 

    const [previewNftImageLayerElements, setPreviewNftImageLayerElements] = useState([]);
    const [previewNftImage, setPreviewNftImage] = useState('');
    
    function generatePreviewNftImage() {
        let generatePreviewNftImageData = new FormData();
        generatePreviewNftImageData.append('nftItemSizeWidth', nftItemSizeWidth);
        generatePreviewNftImageData.append('nftItemSizeHeight', nftItemSizeHeight);
        generatePreviewNftImageData.append('pixelArtActive', pixelArtActive);
        generatePreviewNftImageData.append('roundSystemActive', roundSystemActive);
        generatePreviewNftImageData.append('previewNftImageLayerElementCount', previewNftImageLayerElements.length);
        generatePreviewNftImageData.append('previewNftImageLayerElements', JSON.stringify(previewNftImageLayerElements));
        generatePreviewNftImageData.append('layers', JSON.stringify(layers));
        /* for (var pair of previewNftData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */

        Axios.post('http://localhost:4000/generatePreviewNftImage', generatePreviewNftImageData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                loadPreviewNftImage();
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    function clearPreviewNftImage() {
        Axios.post('http://localhost:4000/clearPreviewNftImage').then(function (response) {
            if(response.data.type === 'success') {
                setPreviewNftImage('');
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }
    
    function loadPreviewNftImage() {
        Axios.get('http://localhost:4000/loadPreviewNftImage').then(function (response) {
            if(response.data !== undefined) {
                setPreviewNftImage(response.data);
            }
        });
    };

    // Progress Bar System -------------------------------------------------- 

    const [progress, setProgress] = useState(0);
    const [progressBarOpacity, setProgressBarOpacity] = useState(0);

    function nftGenerationProgress() {
        let progressPercent = 100 / nftItemCount;
        let currentProgress = 0;
        let currentItemIndex = 0;

        setProgressBarOpacity(1);

        const intervalProgress = setInterval(() => {
            currentItemIndex++;

            let nftGenerationProgressData = new FormData();
            nftGenerationProgressData.append('currentItemIndex', currentItemIndex);
            nftGenerationProgressData.currentItemIndex = currentItemIndex;

            Axios.post('http://localhost:4000/nftGenerationProgress', nftGenerationProgressData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
                if(response.data.type === 'success' && currentItemIndex <= nftItemCount) {
                    currentProgress = currentProgress + progressPercent;
                    setProgress(currentProgress);
                } else if(response.data.type === 'error') {
                    currentItemIndex = 1;
                    clearInterval(intervalProgress);
                    setTimeout(() => {
                        setProgressBarOpacity(0);
                    }, 1292);
                }
            });
        }, 108);
    };

    // Menu System -------------------------------------------------- 

    const [currentMenu, setCurrentMenuVariable] = useState('nft');
    const [currentSubMenu, setCurrentSubMenuVariable] = useState('');
    const [currentSubSubMenu, setCurrentSubSubMenuVariable] = useState('');
    const [currentProperties, setCurrentProperties] = useState('nft');
    
    function setCurrentMenu(value) {
        setCurrentMenuVariable(value);
        setCurrentSubMenuVariable('');
        setCurrentProperties(value);
    }

    function setCurrentSubMenu(value) {
        setCurrentSubMenuVariable(value);
        setCurrentSubSubMenuVariable('');
        setCurrentProperties(value);

        if(currentMenu === 'layers') {
            if(value.split('layer')[1] !== undefined) {
                setCurrentLayer(parseInt(value.split('layer')[1]));
            }
        }
    }

    function setCurrentSubSubMenu(value) {
        setCurrentSubSubMenuVariable(value);
        setCurrentProperties(value);
    }

    function openMetadataProperties() {
        setCurrentMenu('metadata');
        setCurrentProperties('metadata');
    }

    // Draft System -------------------------------------------------- 

    const [draftSaved, setDraftSaved] = useState('');
    const [draftData, setDraftData] = useState(null);

    function saveDraft() {
        setDraftSaved('true');
        let saveDraftData = new FormData();
        saveDraftData.append('nftItemCount', nftItemCount);
        saveDraftData.append('nftItemSizeWidth', nftItemSizeWidth);
        saveDraftData.append('nftItemSizeHeight', nftItemSizeHeight);
        saveDraftData.append('pixelArtActive', pixelArtActive);
        let uniqueNftNamesObject = { uniqueNftNameSystemActive: uniqueNftNameSystemActive, uniqueNftNamesCount: uniqueNftNames.length, uniqueNftNames: uniqueNftNames };
        saveDraftData.append('uniqueNftNames', JSON.stringify(uniqueNftNamesObject));
        saveDraftData.append('nftItemName', nftItemName);
        saveDraftData.append('collectionDescription', collectionDescription);
        let extraMetadataFieldsObject = { extraMetadataFieldsCount: extraMetadataFields.length, extraMetadataFields: extraMetadataFields };
        saveDraftData.append('extraMetadataFields', JSON.stringify(extraMetadataFieldsObject));
        let groupsObject = { groupSystemActive: groupSystemActive, groupCount: groups.length, groupsAttributeName: groupsAttributeName, groups: groups };
        saveDraftData.append('groups', JSON.stringify(groupsObject));
        let roundsObject = { roundSystemActive: roundSystemActive, roundCount: rounds.length, rounds: rounds };
        saveDraftData.append('rounds', JSON.stringify(roundsObject));
        let layersObject = { layerCount: layers.length, layers: layers };
        saveDraftData.append('layers', JSON.stringify(layersObject));
        saveDraftData.append('baseURI', baseURI);
        saveDraftData.append('collageImageRowCount', collageImageRowCount);
        saveDraftData.append('collageImageColumnCount', collageImageColumnCount);
        let previewNftImageObject = { previewNftImage: previewNftImage, previewNftImageLayerElements: previewNftImageLayerElements };
        saveDraftData.append('previewNftImage', JSON.stringify(previewNftImageObject));
        /* for (var pair of saveDraftData.entries()) { console.log(pair[0]+ ', ' + pair[1]); } */

        Axios.post('http://localhost:4000/saveDraft', saveDraftData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
            if(response.data.type === 'success') {
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    const loadDraft = useCallback(() => {
        Axios.get('http://localhost:4000/loadDraft').then(function (response) {
            if(response.data.type === 'success') {
                setNftItemCount(response.data.data.nftItemCount);
                setNftItemSizeWidth(response.data.data.nftItemSizeWidth);
                setNftItemSizeHeight(response.data.data.nftItemSizeHeight);
                setPixelArtActive(response.data.data.pixelArtActive);
                setUniqueNftNameSystemActive(response.data.data.uniqueNftNames.uniqueNftNameSystemActive);
                setUniqueNftNames(response.data.data.uniqueNftNames.uniqueNftNames);
                setNftItemName(response.data.data.nftItemName);
                setCollectionDescription(response.data.data.collectionDescription);
                setExtraMetadataFields(response.data.data.extraMetadataFields.extraMetadataFields);
                setGroupSystemActive(response.data.data.groups.groupSystemActive);
                setGroupsAttributeName(response.data.data.groups.groupsAttributeName);
                setGroups(response.data.data.groups.groups);
                setRounds(response.data.data.rounds.rounds);
                setRoundSystemActive(response.data.data.rounds.roundSystemActive);
                setLayers(response.data.data.layers.layers);
                setBaseURI(response.data.data.baseURI);
                setCollageImageRowCount(response.data.data.collageImageRowCount);
                setCollageImageColumnCount(response.data.data.collageImageColumnCount);
                setPreviewNftImage(response.data.data.previewNftImage.previewNftImage);
                setPreviewNftImageLayerElements(response.data.data.previewNftImage.previewNftImageLayerElements);
                loadPreviewNftImage();
                setDraftSaved('true');
                pushNotification('success', response.data.message);
                setDraftData(response.data.data);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
                setDraftSaved('false');
                setDraftData([]);
            }
        });
    }, [pushNotification]);

    function clearDraft() {
        Axios.post('http://localhost:4000/clearDraft').then(function (response) {
            if(response.data.type === 'success') {
                setDraftSaved('false');
                pushNotification('success', response.data.message);
            } else if(response.data.type === 'error') {
                pushNotification('error', response.data.message);
            }
        });
    }

    useEffect(() => {
        if(draftData === null) {
            setDraftData([]);
            loadDraft();
        }
    }, [draftData, loadDraft]);

    return (
        <React.Fragment>
            <div className='app'>
                <div className='container'>
                    <div className='navBar'>
                        <a className='logo' href='/app'>
                            <img alt='' src='media/logo.png'/>
                        </a>
                        <div className='nftItemNameEdit'>
                            <span>{nftItemName.length > 16 ? nftItemName.slice(0, 16) + '...' : (nftItemName === '' ? 'Nft Item Name' : nftItemName)}</span>
                            <button type='button' onClick={(e) => { e.preventDefault(); openMetadataProperties();}}><i className='fa-solid fa-pencil'></i></button>
                        </div>
                        <div className='draftButtons'>
                            <button className={draftSaved === 'false' ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); saveDraft(); }}><i className="fa-solid fa-cloud-arrow-up"></i> Save Draft</button>
                            <button className={draftSaved === 'false' ? 'disabledButton' : ''} onClick={(e) => { e.preventDefault(); loadDraft(); }}><i className="fa-solid fa-cloud-arrow-down"></i> Load Draft</button>
                            <button className={draftSaved === 'false' ? 'disabledButton' : ''} onClick={(e) => { e.preventDefault(); clearDraft(); }}><i className="fa-solid fa-cloud"></i> Clear Draft</button>
                        </div> 
                        <div className='downloadNftBar'>
                            <button onClick={(e) => { e.preventDefault(); generateNftCollection(); }}><i className='fa-solid fa-bolt'></i> Generate Collection</button>
                            <button className='blackButton' onClick={(e) => { e.preventDefault(); downloadNftCollection(); }}><i className='fas fa-download'></i> Download Collection</button>
                            <button className='blackButton' onClick={(e) => { e.preventDefault(); downloadRarityScoreList(); }}><i className='fas fa-download'></i> Rarity Score List</button>
                        </div> 
                        <button className='profileMenu'>
                            <img alt='' src='media/profile.png'/>
                            <i className='fa-solid fa-angle-down'></i>
                        </button>
                    </div>
                    <div className='subContainer'>
                        <div className='leftBar'>
                            <div className='leftBarTopDiv'>
                                <button className={currentMenu === 'nft' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('nft');}}>
                                    <i className='fa-solid fa-seedling'></i>
                                    <span>Nft</span>
                                </button>
                                <button className={currentMenu === 'metadata' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('metadata');}}>
                                    <i className='fa-solid fa-fingerprint'></i>
                                    <span>Metadata</span>
                                </button>
                                <button className={currentMenu === 'layers' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('layers');}}>
                                    <i className='fa-solid fa-layer-group'></i>
                                    <span>Layers</span>
                                </button>
                                {uniqueNftNameSystemActive === 'true' ? (
                                    <>
                                        <button className={currentMenu === 'uniqueNfts' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('uniqueNfts');}}>
                                            <i className='fa-solid fa-dice-d20'></i>
                                            <span>Unique Nfts</span>
                                        </button>
                                    </>
                                ) : (<></>)}
                                {groupSystemActive === 'true' ? (
                                    <>
                                        <button className={currentMenu === 'groups' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('groups');}}>
                                            <i className='fa-solid fa-object-group'></i>
                                            <span>Groups</span>
                                        </button>
                                    </>
                                ) : (<></>)}
                                {roundSystemActive === 'true' ? (
                                    <>
                                        <button className={currentMenu === 'rounds' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('rounds');}}>
                                            <i className='fa-solid fa-list-ol'></i>
                                            <span>Rounds</span>
                                        </button>
                                    </>
                                ) : (<></>)}
                                <button className={currentMenu === 'baseURI' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('baseURI');}}>
                                    <i className='fa-solid fa-globe'></i>
                                    <span>Base URI</span>
                                </button>
                                <button className={currentMenu === 'collageImage' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('collageImage');}}>
                                    <i className='fa-solid fa-images'></i>
                                    <span>Collage Image</span>
                                </button>
                                <button className={currentMenu === 'previewNftImage' ? 'activatedLeftBarTopButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentMenu('previewNftImage');}}>
                                    <i className='fa-solid fa-image'></i>
                                    <span>Preview Nft Image</span>
                                </button>
                            </div>
                            <div className='leftBarBottomDiv'>
                                <div className='line'></div>
                                <button>
                                    <i className='fa-solid fa-gear'></i>
                                    <span>Setting</span>
                                </button>
                                <button>
                                    <i className='fa-solid fa-language'></i>
                                    <span>Language</span>
                                </button>
                            </div>
                        </div>
                        <div className='mainArea'>
                            <ProgressBar progress={progress} progressBarOpacity={progressBarOpacity}/>
                            {layers.length > 0 && currentMenu === 'layers' ? (
                                <>
                                    <div className='subLeftBar'>
                                        <div className='subLeftBarDiv'>
                                            {layers.map((layer, index) => ( <LayerButton key={'layer' + index} layerIndex={index + 1} currentSubMenu={currentSubMenu} setCurrentSubMenu={setCurrentSubMenu}/> ))}
                                        </div>
                                    </div>
                                </>
                            ) : (<></>)}
                            {layers.length > 0 && currentMenu === 'layers' && currentSubMenu === 'layer' + currentLayer && layers[currentLayer - 1].elements.length > 0 ? (
                                <>
                                    <div className='subSubLeftBar'>
                                        <div className='subSubLeftBarDiv'>
                                            {<ElementsButton key={currentLayer} elementCount={layers[currentLayer - 1].elements.length} currentSubSubMenu={currentSubSubMenu} setCurrentSubSubMenu={setCurrentSubSubMenu}/>}
                                        </div>
                                    </div>
                                </>
                            ) : (<></>)}
                            {rounds.length > 0 && currentMenu === 'rounds' ? (
                                <>
                                    <div className='subLeftBar'>
                                        <div className='subLeftBarDiv'>
                                            {rounds.map((round, index) => ( <RoundButton key={'round' + index} roundIndex={index + 1} currentSubMenu={currentSubMenu} setCurrentSubMenu={setCurrentSubMenu}/> ))}
                                        </div>
                                    </div>
                                </>
                            ) : (<></>)}
                            <div className='previewNftImage'>
                                <img alt='' src={previewNftImage === '' ? '/media/previewNftImageTemp.png' : `data:image/png;base64,${previewNftImage}`}/>
                            </div>
                            <div className='imageButtons'>
                                <button>-</button>
                                <span>100%</span>
                                <button>+</button>
                                <button><i className='fa-solid fa-expand'></i> Full Screen</button>
                            </div>
                            <Notification notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                        <div className='rightBar'>
                            {currentProperties === 'nft' ? (
                                <>
                                    <h2><i className='fa-solid fa-seedling'></i> Nft Properties</h2>
                                    <div className='line'></div>
                                    <span>Nft Item Count</span>
                                    <input autoComplete='off' type='number' min='1' onChange={(e) => { e.preventDefault(); setNftItemCount(e.target.value);}} value={nftItemCount}/>
                                    <span>Nft Item Size</span>
                                    <div className='smallInputs'>
                                        <div>
                                            <span>Width</span>
                                            <input autoComplete='off' type='number' min='1' max='10000' onChange={(e) => { e.preventDefault(); setNftItemSizeWidth(e.target.value);}} value={nftItemSizeWidth}/>
                                        </div>
                                        <div>
                                            <span>Height</span>
                                            <input autoComplete='off' type='number' min='1' max='10000' onChange={(e) => { e.preventDefault(); setNftItemSizeHeight(e.target.value);}} value={nftItemSizeHeight}/>
                                        </div>
                                    </div>
                                    <span>Is Nft Pixel Art</span>
                                    <select onChange={(e) => { e.preventDefault(); setPixelArtActive(e.target.value);}} value={pixelArtActive}>
                                        <option value='true'>Yes</option>
                                        <option value='false'>No</option>
                                    </select> 
                                    <span>Do you want to add unique Nfts</span>
                                    <select onChange={(e) => { e.preventDefault(); setUniqueNftNameSystemActive(e.target.value);}} value={uniqueNftNameSystemActive}>
                                        <option value='true'>Yes</option>
                                        <option value='false'>No</option>
                                    </select>
                                    <span>Do you want to add groups to Nfts</span>
                                    <select onChange={(e) => { e.preventDefault(); setGroupSystemActive(e.target.value);}} value={groupSystemActive}>
                                        <option value='true'>Yes</option>
                                        <option value='false'>No</option>
                                    </select>
                                    <span>Do you want to add rounds to Collection</span>
                                    <select onChange={(e) => { e.preventDefault(); setRoundSystemActive(e.target.value);}} value={roundSystemActive}>
                                        <option value='true'>Yes</option>
                                        <option value='false'>No</option>
                                    </select>
                                </>
                            ) : (<></>)}
                            {currentProperties === 'metadata' ? (
                                <>
                                    <h2><i className='fa-solid fa-fingerprint'></i> Metadata Properties</h2>
                                    <div className='line'></div>
                                    <span>Nft Item Name</span>
                                    <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setNftItemName(e.target.value);}} value={nftItemName}/>
                                    <span>Collection Description</span>
                                    <input autoComplete='off' type='text' className='longInput' onChange={(e) => { e.preventDefault(); setCollectionDescription(e.target.value);}} value={collectionDescription}/>
                                    <span>Extra Metadata Fields</span>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); addNewExtraMetadataField(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                                        <button type='button' className={extraMetadataFields.length > 0 ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); removeLastExtraMetadataField(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                                    </div>
                                    <div className='extraMetadataFieldDiv'>
                                        {extraMetadataFields.map((extraMetadataField, index) => ( <ExtraMetadataField key={'extraMetadataField' + index} extraMetadataFieldIndex={index} extraMetadataFields={extraMetadataFields} setExtraMetadataFields={setExtraMetadataFields}/> ))}
                                    </div>
                                </>
                            ) : (<></>)}
                            {currentProperties === 'layers' ? (
                                <>
                                    <h2><i className='fa-solid fa-layer-group'></i> Layers Properties</h2>
                                    <div className='line'></div>
                                    <span>Layers</span>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); addNewLayer(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                                        <button type='button' onClick={(e) => { e.preventDefault(); removeLastLayer(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                                    </div>
                                </>
                            ) : (<></>)}
                            <LayerProperties currentProperties={currentProperties} layers={layers} setLayers={setLayers} uniqueNftNames={uniqueNftNames} uniqueNftNameOptions={uniqueNftNameOptions} setUniqueNftNameOptions={setUniqueNftNameOptions}/>
                            <ElementProperties pushNotification={pushNotification} currentSubMenu={currentSubMenu} currentProperties={currentProperties} layers={layers} setLayers={setLayers} uniqueNftNames={uniqueNftNames} uniqueNftNameOptions={uniqueNftNameOptions} setUniqueNftNameOptions={setUniqueNftNameOptions} uniqueNftNameSystemActive={uniqueNftNameSystemActive} groups={groups} groupSystemActive={groupSystemActive}/>
                            {currentProperties === 'uniqueNfts' ? (
                                <>
                                    <h2><i className='fa-solid fa-dice-d20'></i> Unique Nfts Properties</h2>
                                    <div className='line'></div>
                                    <span>Unique Nft Name</span>
                                    <input autoComplete='off'type='text' onChange={(e) => { e.preventDefault(); setCurrentUniqueNftName(e.target.value); }} value={currentUniqueNftName}/>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); addNewUniqueNftName(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                                        <button className={uniqueNftNames.length > 0 ? '' : 'disabledButton'} type='button' onClick={(e) => { e.preventDefault(); removeLastUniqueNftName(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                                    </div>
                                    {uniqueNftNames.map((uniqueNftName, index) => ( <UniqueNftName key={'uniqueNftName' + index} uniqueNftNameIndex={index + 1} uniqueNftName={uniqueNftName}/> ))}
                                </>
                            ) : (<></>)}
                            {currentProperties === 'groups' ? (
                                <>
                                    <h2><i className='fa-solid fa-object-group'></i> Groups Properties</h2>
                                    <div className='line'></div>
                                    <span>Attribute Name</span>
                                    <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setGroupsAttributeName(e.target.value); }} value={groupsAttributeName}/>
                                    <span>New Group Name</span>
                                    <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); setCurrentGroupName(e.target.value); }} value={currentGroupName}/>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); addNewGroup(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                                        <button className={groups.length > 0 ? '' : 'disabledButton'} type='button' onClick={(e) => { e.preventDefault(); removeLastGroup(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                                    </div>
                                    {groups.map((group, index) => ( <GroupName key={'group' + index} groupIndex={index + 1} groupName={group}/> ))}
                                </>
                            ) : (<></>)}
                            {currentProperties === 'rounds' ? (
                                <>
                                    <h2><i className='fa-solid fa-list-ol'></i> Rounds Properties</h2>
                                    <div className='line'></div>
                                    <span>Rounds</span>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); addNewRound(); }}><i className='fa-solid fa-plus'></i> Add New</button>
                                        <button type='button' onClick={(e) => { e.preventDefault(); removeLastRound(); }}><i className='fa-solid fa-trash-can'></i> Remove Last</button>
                                    </div>
                                </>
                            ) : (<></>)}
                            <RoundProperties currentProperties={currentProperties} rounds={rounds} setRounds={setRounds}/> 
                            {currentProperties === 'baseURI' ? (
                                <>
                                    <h2><i className='fa-solid fa-globe'></i> Base URI Properties</h2>
                                    <div className='line'></div>
                                    <span>Base URI</span>
                                    <input autoComplete='off' name='baseURI' type='text' className='longInput' onChange={(e) => { e.preventDefault(); setBaseURI(e.target.value); }} value={baseURI}/>
                                    <button type='button' onClick={(e) => { e.preventDefault(); updateBaseURI(); }}><i className='fa-solid fa-arrows-rotate'></i> Update</button>
                                </>
                            ) : (<></>)}
                            {currentProperties === 'collageImage' ? (
                                <>
                                    <h2><i className='fa-solid fa-images'></i> Collage Image Properties</h2>
                                    <div className='line'></div>
                                    <span>Collage Image</span>
                                    <div className='smallInputs'>
                                        <div>
                                            <span>Row Count</span>
                                            <input autoComplete='off' type='number' min='1' onChange={(e) => { e.preventDefault(); setCollageImageRowCount(e.target.value); }} value={collageImageRowCount}/>
                                        </div>
                                        <div>
                                            <span>Column Count</span>
                                            <input autoComplete='off' type='number' min='1' onChange={(e) => { e.preventDefault(); setCollageImageColumnCount(e.target.value); }} value={collageImageColumnCount}/>
                                        </div>
                                    </div>
                                    <div className='smallButtons'>
                                        <button type='button' onClick={(e) => { e.preventDefault(); generateCollageImage(); }}><i className='fa-solid fa-bolt'></i> Generate</button>
                                        <button className='blackButton' type='button' onClick={(e) => { e.preventDefault(); downloadCollageImage(); }}><i className='fas fa-download'></i> Download</button>
                                    </div>
                                </>
                            ) : (<></>)}
                            {currentProperties === 'previewNftImage' ? (
                                <>
                                    <h2><i className='fa-solid fa-image'></i> Preview Nft Properties</h2>
                                    <div className='line'></div>
                                    <span>Preview Nft Image</span>
                                    <div className='smallButtons'>
                                        <button className={layers.length > 0 ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); generatePreviewNftImage(); }}><i className="fa-solid fa-image"></i> Generate</button>
                                        <button className={layers.length > 0 ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); clearPreviewNftImage(); }}><i className="fa-solid fa-trash-can"></i> Clear</button>
                                    </div>
                                    <button hidden className={layers.length > 0 ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); }}><i className="fa-solid fa-shuffle"></i> Random</button>
                                    {layers.map((layer, index) => ( <LayerElementSelect key={'layer' + index} layers={layers} layerIndex={index} previewNftImageLayerElements={previewNftImageLayerElements} setPreviewNftImageLayerElements={setPreviewNftImageLayerElements}/> ))}
                                </>
                            ) : (<></>)}
                            <div className='paddingDiv'></div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}





