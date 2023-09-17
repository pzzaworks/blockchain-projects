import React, { useState, useEffect, useRef, useCallback } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io  from "socket.io-client";
import Web3 from "web3";

import Countdown from './components/countdown';
import EventListener from './components/eventListener';

function App() {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  //const data = useSelector((state) => state.data);

  const paintState = true; 
  const contractAddress = "0x2648e6BC01AA3aE8a8194118Fa5d7FE550a0eb98";
  const weiCost = "2700000000000000";
  const baseGasLimit = "285000";
  const paintPrice = "0.0027";

  const [paintProcessState, setPaintProcessState] = useState(false);
  
  const [paintColor, setPaintColor] = useState('#FFFFFF');
  const [infoPopupActive, setInfoPopupActive] = useState(false);

  const notificationRef = useRef(null);
  const blockchainNotificationRef = useRef(null);
  const [notification, setNotification] = useState("");

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const canvasSize = { width: 1000, height: 1000 };
  const minCanvasScale = 0.25;
  const maxCanvasScale = 50;
  const [zoomRatio, setZoomRatio] = useState(0.25);
  const defaultCanvasScale = 0.5;
  const [zoomContainerTransform, setZoomContainerTransform] = useState({ x: null, y: null, scale: null });
  const [canvasScale, setCanvasScale] = useState(defaultCanvasScale);
  const [currentMouseCoordinates, setCurrentMouseCoordinates] = useState({ x: 0, y: 0 });
  const [currentTouchCoordinates, setCurrentTouchCoordinates] = useState({ x: 0, y: 0 });
  //const [currentTouchDistance, setCurrentTouchDistance] = useState(0);
  const [enablePanning, setEnablePanning] = useState(false);

  const canvasScaleToShowGrid = 22.5;
  const [gridOpacity, setGridOpacity] = useState(0);
    
  const selectedPixelRef = useRef(null);
  const [selectedPixel, setSelectedPixel] = useState({ left: 0, top: 0 });
  const [selectedPixelLeftInputWidth, setSelectedPixelLeftInputWidth] = useState(1);
  const [selectedPixelTopInputWidth, setSelectedPixelTopInputWidth] = useState(1);

  const [pixels, setPixels] = useState([]);

  const [countdownDays, setCountdownDays] = useState(0);
  const [countdownHours, setCountdownHours] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const [menuMobileActive, setMenuMobileActive] = useState(false);
  const [welcomePopupActive, setWelcomePopupActive] = useState(null);
  
  const colorPaletteItems = [
    {name: 'Yellow', code: '#FFD635'},
    {name: 'Light Orange', code: '#FFA800'},
    {name: 'Orange', code: '#FF4500'},
    {name: 'Red', code: '#BE0039'},
    {name: 'Light Purple', code: '#B44AC0'},
    {name: 'Purple', code: '#811E9F'},
    {name: 'Dark Blue', code: '#493AC1'},
    {name: 'Blue', code: '#3690EA'},
    {name: 'Green', code: '#00A368'},
    {name: 'Light Green', code: '#00CC78'},
    {name: 'White', code: '#FFFFFF'},
    {name: 'Light Gray', code: '#D4D7D9'},
    {name: 'Gray', code: '#898D90'},
    {name: 'Black', code: '#000000'}
  ];

  const getData = useCallback(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.account, blockchain.smartContract, dispatch]);

  const connectWallet = useCallback (() => {
    dispatch(connect()); 
    getData();
  }, [dispatch, getData]);

  const paint = async () => {
    let currentSelectedPixel = selectedPixel;
    let currentPaintColor = paintColor;
    let currentAddress = blockchain.account;

    setNotification("Painting.");
    setPaintProcessState(true);

    let checkCoordinateAddressAndColor = pixels[currentSelectedPixel.left][currentSelectedPixel.top].address === currentAddress && pixels[currentSelectedPixel.left][currentSelectedPixel.top].color === currentPaintColor;

    if(!checkCoordinateAddressAndColor) {
      blockchain.smartContract.methods.paintCoordinate(currentSelectedPixel.left, currentSelectedPixel.top, currentAddress, currentPaintColor).send({
        gasLimit: String(baseGasLimit),
        to: contractAddress,
        from: currentAddress,
        value: String(weiCost),
  
      }).once("error", (error) => {
        if(error.message === "MetaMask Tx Signature: User denied transaction signature."){
          setNotification("User denied transaction signature.");
        } else if (error.message.split("Returned error: Error: VM Exception while processing transaction: reverted with reason string '")[1] !== undefined) {
          setNotification(error.message.split("Returned error: Error: VM Exception while processing transaction: reverted with reason string '")[1].slice(0, -1));
        } else {
          setNotification(error.message);
        }
        setPaintProcessState(false);
      }).then((receipt) => {
        savePixel(currentSelectedPixel, currentAddress, currentPaintColor, 1000);
      });
    } else {
      setNotification("Same address already painted same color into this coordinate.");
      setPaintProcessState(false);
    }
  };

  const startCountdown = () => {
      let countdownDate = new Date("June 30, 2022 15:00:00").getTime();
      
      let intervalCountdown = setInterval(() => {
          let currentDate = new Date().getTime();
          let distance = countdownDate - currentDate;
          
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (distance < 0) {
              clearInterval(intervalCountdown.current);
          } else {
              setCountdownDays(days);
              setCountdownHours(hours);
              setCountdownMinutes(minutes);
              setCountdownSeconds(seconds);
          }
      });
  };

  function activeInfoPopup() {
    if(infoPopupActive === false) {
      setInfoPopupActive(true);
    } else {
      setInfoPopupActive(false);
    }
  };

  function activeMenuMobile() {
    if(menuMobileActive === false) {
      setMenuMobileActive(true);
    } else {
      setMenuMobileActive(false);
    }
  };

  function getDynamicZoomRatio() {
    let currentZoomRatio = zoomRatio;

    if(canvasScale < 2) {
      setZoomRatio(0.25);
      currentZoomRatio = 0.25;
    } else if(canvasScale >= 2 && canvasScale < 5) {
      setZoomRatio(1);
      currentZoomRatio = 1;
    } else if(canvasScale >= 5 && canvasScale < 10) {
      setZoomRatio(2.5);
      currentZoomRatio = 2.5;
    } else  if(canvasScale >= 10 && canvasScale <= 50) {
      setZoomRatio(5);
      currentZoomRatio = 5;
    }
    return currentZoomRatio;
  };

  function zoomOut() {
    if(canvasScale > minCanvasScale) {
      let newCanvasScale = canvasScale;

      const selectedPixelBounding = selectedPixelRef.current.getBoundingClientRect();
      let scaleX = (selectedPixelBounding.left - zoomContainerTransform.x) / newCanvasScale;
      let scaleY = (selectedPixelBounding.top - zoomContainerTransform.y) / newCanvasScale;

      newCanvasScale = newCanvasScale - getDynamicZoomRatio();

      if(newCanvasScale < canvasScaleToShowGrid) {
        setGridOpacity(0);
      } else {
        setGridOpacity(1);
      }

      setCanvasScale(newCanvasScale);
      setZoomContainerTransform({ x: (selectedPixelBounding.left - scaleX * newCanvasScale), y: (selectedPixelBounding.top - scaleY * newCanvasScale), scale: newCanvasScale });
    }
  };

  function zoomIn() {
    if(canvasScale < maxCanvasScale) {
        let newCanvasScale = canvasScale;

        const selectedPixelBounding = selectedPixelRef.current.getBoundingClientRect();
        let scaleX = (selectedPixelBounding.left - zoomContainerTransform.x) / newCanvasScale;
        let scaleY = (selectedPixelBounding.top - zoomContainerTransform.y) / newCanvasScale;

        newCanvasScale = newCanvasScale + getDynamicZoomRatio();

        if(newCanvasScale < canvasScaleToShowGrid) {
          setGridOpacity(0);
        } else {
          setGridOpacity(1);
        }

        setCanvasScale(newCanvasScale);
        setZoomContainerTransform({ x: (selectedPixelBounding.left - scaleX * newCanvasScale), y: (selectedPixelBounding.top - scaleY * newCanvasScale), scale: newCanvasScale });
    }
  };

  function zoomReset() {        
    let x = (window.innerWidth / 2) - ((canvasSize.width / 2) * defaultCanvasScale);
    let y = (window.innerHeight / 2) - ((canvasSize.height / 2) * defaultCanvasScale);
  
    setGridOpacity(0);
    setZoomContainerTransform({ x: x, y: y, scale: defaultCanvasScale });
    setCanvasScale(defaultCanvasScale);
  };
  
  function onScrollZoom(e) {
    let newCanvasScale = canvasScale;
    let scaleX = (e.clientX - zoomContainerTransform.x) / newCanvasScale;
    let scaleY = (e.clientY - zoomContainerTransform.y) / newCanvasScale;
    let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

    if(delta > 0) {
        if(canvasScale < maxCanvasScale) {
            newCanvasScale = newCanvasScale + getDynamicZoomRatio();
            setCanvasScale(newCanvasScale);
        }
    } else {
        if(canvasScale > minCanvasScale) {
            newCanvasScale = newCanvasScale - getDynamicZoomRatio();
            setCanvasScale(newCanvasScale);
        }
    }  

    if(newCanvasScale < canvasScaleToShowGrid) {
      setGridOpacity(0);
    } else {
      setGridOpacity(1);
    }

    setZoomContainerTransform({ x: (e.clientX - scaleX * newCanvasScale), y: (e.clientY - scaleY * newCanvasScale), scale: newCanvasScale });
  };

  function setCurrentMouseCoordinatesFunc(e) {
    e.preventDefault();

    let currentMouseCoordinateX = e.clientX - zoomContainerTransform.x;
    let currentMouseCoordinateY = e.clientY - zoomContainerTransform.y;

    selectPixel(currentMouseCoordinateX, currentMouseCoordinateY);

    setCurrentMouseCoordinates({ x: currentMouseCoordinateX, y: currentMouseCoordinateY });
    setEnablePanning(true);
  };

  function selectPixel(currentMouseCoordinateX, currentMouseCoordinateY) {
    let pixelCoordinateTop = parseInt(currentMouseCoordinateY / canvasScale);
    let pixelCoordinateLeft = parseInt(currentMouseCoordinateX / canvasScale);
    
    if(pixelCoordinateTop >= canvasSize.height) {
      pixelCoordinateTop = pixelCoordinateTop - 1;
    }

    if(pixelCoordinateTop < 0) {
      pixelCoordinateTop = pixelCoordinateTop + 1;
    }

    if(pixelCoordinateLeft >= canvasSize.width) {
        pixelCoordinateLeft = pixelCoordinateLeft - 1;
    }

    if(pixelCoordinateLeft < 0) {
      pixelCoordinateLeft = pixelCoordinateLeft + 1;
    }

    if(pixelCoordinateLeft < 10) {
      setSelectedPixelLeftInputWidth(1);
    } else if(pixelCoordinateLeft >= 10 && pixelCoordinateLeft < 99) {
      setSelectedPixelLeftInputWidth(1.75);
    } else if (pixelCoordinateLeft >= 99) {
      setSelectedPixelLeftInputWidth(2.5);
    }

    if(pixelCoordinateTop < 10) {
      setSelectedPixelTopInputWidth(1);
    } else if(pixelCoordinateTop >= 10 && pixelCoordinateTop < 99) {
      setSelectedPixelTopInputWidth(1.75);
    } else if (pixelCoordinateTop >= 99) {
      setSelectedPixelTopInputWidth(2.5);
    }

    setSelectedPixel({ left: pixelCoordinateLeft, top: pixelCoordinateTop });
  };

  function setCurrentTouchCoordinatesFunc(e) {
    let event = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    let touch = event.touches[0] || event.changedTouches[0];
    let currentTouchCoordinateX = touch.pageX - zoomContainerTransform.x;
    let currentTouchCoordinateY = touch.pageY - zoomContainerTransform.y;

    selectPixel(currentTouchCoordinateX, currentTouchCoordinateY);

    setCurrentTouchCoordinates({ x: currentTouchCoordinateX, y: currentTouchCoordinateY });
    setEnablePanning(true);
  };

  function panning(e) {
    e.preventDefault();
    if (!enablePanning) return;

    setZoomContainerTransform({ x: (e.clientX - currentMouseCoordinates.x), y: (e.clientY - currentMouseCoordinates.y), scale: zoomContainerTransform.scale });
  };

  function panningTouch(e) {
    let event = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    let touch = event.touches[0] || event.changedTouches[0];
    if (!enablePanning) return;
    
    setZoomContainerTransform({ x: (touch.pageX - currentTouchCoordinates.x), y: (touch.pageY - currentTouchCoordinates.y), scale: zoomContainerTransform.scale });
  };

  function checkMouseLeave(e) {
    e.preventDefault();
    setEnablePanning(false);
  };

  function focusOnSelectedPixel() {
    selectedPixelRef.current.focus();
  };

  const keyDownEventListenerHandler = useCallback((e) => {
    let currentSelectedPixelTop = selectedPixel.top;
    let currentSelectedPixelLeft = selectedPixel.left;

    if ((e.keyCode === 38 && currentSelectedPixelTop > 0) || (e.keyCode === 87 && currentSelectedPixelTop > 0)) {
      currentSelectedPixelTop = currentSelectedPixelTop - 1;
    }
    else if ((e.keyCode === 40 && currentSelectedPixelTop < canvasSize.height) || (e.keyCode === 83 && currentSelectedPixelTop < canvasSize.height)) {
      currentSelectedPixelTop = currentSelectedPixelTop + 1;
    }
    else if ((e.keyCode === 37 && currentSelectedPixelLeft > 0) || (e.keyCode === 65 && currentSelectedPixelLeft > 0)) {
      currentSelectedPixelLeft = currentSelectedPixelLeft - 1;
    }
    else if ((e.keyCode === 39 && currentSelectedPixelLeft < canvasSize.width) || (e.keyCode === 68 && currentSelectedPixelLeft < canvasSize.width)) {
      currentSelectedPixelLeft = currentSelectedPixelLeft + 1;
    }

    if(currentSelectedPixelLeft < 10) {
      setSelectedPixelLeftInputWidth(1);
    } else if(currentSelectedPixelLeft >= 10 && currentSelectedPixelLeft < 99) {
      setSelectedPixelLeftInputWidth(1.75);
    } else if (currentSelectedPixelLeft >= 99) {
      setSelectedPixelLeftInputWidth(2.5);
    }

    if(currentSelectedPixelTop < 10) {
      setSelectedPixelTopInputWidth(1);
    } else if(currentSelectedPixelTop >= 10 && currentSelectedPixelTop < 99) {
      setSelectedPixelTopInputWidth(1.75);
    } else if (currentSelectedPixelTop >= 99) {
      setSelectedPixelTopInputWidth(2.5);
    }

    setSelectedPixel({ left: currentSelectedPixelLeft, top: currentSelectedPixelTop });
  }, [setSelectedPixelLeftInputWidth, setSelectedPixel, canvasSize.width, canvasSize.height, selectedPixel.top, selectedPixel.left]);

  EventListener('keydown', keyDownEventListenerHandler);

  const resizeEventListenerHandler = useCallback((e) => {
    if(window.innerWidth > 920) {
      setMenuMobileActive(false);
    } else {
      setInfoPopupActive(false);
    }
  }, []);

  EventListener('resize', resizeEventListenerHandler);

  function loadPixel(currentSelectedPixel) {
    socket.emit("loadPixel", currentSelectedPixel);
  };

  const loadCanvas = useCallback(() => {
    Axios.get('https://api.painttoearn.io/loadCanvas').then(function (response) {
      if(response.data.type === 'success') {
          let responseData = response.data.data;
          let pixelsArray = [];

          for(let i = 0; i < canvasSize.width; i++) {
            let currentPixelsArrayX = responseData.filter(data => data.x === i);
            pixelsArray.push([]);

            for(let j = 0; j < canvasSize.height; j++) {
              pixelsArray[i].push({ color: currentPixelsArrayX[j].color, address: currentPixelsArrayX[j].address });
            }
          }

          for(let i=0; i < canvasSize.width; i++) {
            for(let j=0; j < canvasSize.height; j++) {
              contextRef.current.fillStyle = pixelsArray[i][j].color;
              contextRef.current.fillRect(i, j, 1, 1);
            }
          }
    
          setPixels(pixelsArray);
          setCanvasData(pixelsArray);
          setCanvasLoaded(true);
      } else if(response.data.type === 'error') {
        let pixelsArray = [];

        for(let i=0; i < canvasSize.width; i++) {
          pixelsArray.push([]);
          for(let j=0; j < canvasSize.height; j++) {
            pixelsArray[i].push({ color: '#000000', address: '0x0000000000000000000000000000000000000000' });
            contextRef.current.fillStyle = '#000000';
            contextRef.current.fillRect(i, j, 1, 1);
          }
        }
        setPixels(pixelsArray);
        setCanvasData([]);
      }
    });
  }, [canvasSize.width, canvasSize.height]);

  async function savePixel(currentSelectedPixel, currentAddress, currentPaintColor, count) {
    if(count !== 0) {
      let pixelsData = new FormData();
      pixelsData.append('currentSelectedPixel', JSON.stringify(currentSelectedPixel));
  
      let currentAddressSC = Web3.utils.toChecksumAddress(await blockchain.smartContract.methods.getCoordinateAddress(currentSelectedPixel.left, currentSelectedPixel.top).call());
      let currentPaintColorSC = await blockchain.smartContract.methods.getCoordinateColor(currentSelectedPixel.left, currentSelectedPixel.top).call();

      if((currentAddressSC === '0x0000000000000000000000000000000000000000' && currentPaintColorSC === '#000000') ||
        (currentAddressSC === Web3.utils.toChecksumAddress(currentAddress) && currentPaintColorSC === currentPaintColor)) {

        if(currentAddressSC === '0x0000000000000000000000000000000000000000' && currentPaintColorSC === '#000000') {
          pixelsData.append('currentPaintColor', currentPaintColor);
          pixelsData.append('currentAddress', currentAddress);
        } else {
          pixelsData.append('currentPaintColor', currentPaintColorSC);
          pixelsData.append('currentAddress', currentAddressSC);
        }
    
        Axios.post('https://api.painttoearn.io/savePixel', pixelsData, { headers: { 'Content-Type': 'multipart/form-data', }}).then(function (response) {
          if(response.data.type === 'success') {
            loadPixel(currentSelectedPixel);
          } else if(response.data.type === 'error') {}
        
          setNotification("Successfully painted.");
          setPaintProcessState(false);
          dispatch(fetchData(blockchain.account));
        });
      } else {
        return savePixel(currentSelectedPixel, currentAddress, currentPaintColor, count - 1);
      }
    } else {
      setNotification("Successfully painted.");
      setPaintProcessState(false);
      dispatch(fetchData(blockchain.account));
    }
  };

  function updateSelectedPixelLeft(value) {
    let currentSelectedPixel = selectedPixel;
    let currentValue = parseInt(value);

    if(isNaN(currentValue)) {
      currentValue = 0;
    }

    if(currentValue <= 0 || currentValue > (canvasSize.width - 1) || value === '') {
      currentValue = 0;
    }

    if(currentValue < 10) {
      setSelectedPixelLeftInputWidth(1);
    } else if(currentValue >= 10 && currentValue < 99) {
      setSelectedPixelLeftInputWidth(1.75);
    } else if (currentValue >= 99) {
      setSelectedPixelLeftInputWidth(2.5);
    }

    setSelectedPixel({ left: currentValue, top: currentSelectedPixel.top });
  };

  function updateSelectedPixelTop(value) {
    let currentSelectedPixel = selectedPixel; 
    let currentValue = parseInt(value);

    if(isNaN(currentValue)) {
      currentValue = 0;
    }
    
    if(currentValue <= 0 || currentValue > (canvasSize.height - 1) || value === '') {
      currentValue = 0;
    }

    if(currentValue < 10) {
      setSelectedPixelTopInputWidth(1);
    } else if(currentValue >= 10 && currentValue < 99) {
      setSelectedPixelTopInputWidth(1.75);
    } else if (currentValue >= 99) {
      setSelectedPixelTopInputWidth(2.5);
    }

    setSelectedPixel({ left: currentSelectedPixel.left, top: currentValue });
  };

  function downloadCanvas() {
    let image = canvasRef.current.toDataURL();
    let downloadLink = document.createElement('a');
    let today = new Date();
    downloadLink.download = 'PaintToEarn_' + ("0" + today.getDate()).slice(-2) + '_' + ("0" + (today.getMonth() + 1)).slice(-2) + '_' + today.getFullYear() + '.png';
    downloadLink.href = image;
    downloadLink.click();
  };

  useEffect(() => {
    if(welcomePopupActive === null) {
      setSocket(io("https://api.painttoearn.io"));

      const icons = [
        {image : "media/close.svg"},
        {image : "media/info.svg"},
        {image : "media/twitter.svg"},
        {image : "media/medium.svg"},
        {image : "media/snowtrace.svg"}
      ];

      for( let i=0; i < icons.length; i++) {
        let img = new Image();
        img.src = icons[i].image;
      }

      startCountdown();

      setWelcomePopupActive(true);

      connectWallet();
    }
  }, [welcomePopupActive, connectWallet]);

  useEffect(() => {
    if(selectedPixelRef) {
      selectedPixelRef.current.focus();
    }
  }, [selectedPixelRef]);

  useEffect(() => {
    if(zoomContainerTransform.x === null && zoomContainerTransform.y === null && zoomContainerTransform.scale === null) {
      const canvas = canvasRef.current
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;
      context.scale = (defaultCanvasScale, defaultCanvasScale);
      contextRef.current = context;

      for (let i = 0; i < canvasSize.width; i += 1) {
        context.moveTo(i, 0);
        context.lineTo(i, canvasSize.width);
      }
      
      for (let i = 0; i < canvasSize.height; i += 1) {
        context.moveTo(0, i);
        context.lineTo(canvasSize.height, i);
      }

      context.strokeStyle = "#777777";
      context.stroke();

      let x = window.innerWidth / 2 - ((canvasSize.width / 2) * canvasScale);
      let y = window.innerHeight / 2 - ((canvasSize.height / 2) * canvasScale);
      setZoomContainerTransform({ x: x, y: y, scale: defaultCanvasScale });
    }
  }, [canvasScale, canvasSize.width, canvasSize.height, zoomContainerTransform.x, zoomContainerTransform.y, zoomContainerTransform.scale]);

  useEffect(() => {
    if (!socket) return;

    if(socketConnected === false) {
      socket.connect();
    }

    socket.on('connect', () => {
      setSocketConnected(socket.connected);
    });

    socket.on("loadPixelData", (loadPixelData) => {
      if(pixels.length > 0) {
        let currentPixelData = loadPixelData;

        let pixelsArray = [...pixels];

        pixelsArray[currentPixelData.x][currentPixelData.y].color = currentPixelData.color;
        pixelsArray[currentPixelData.x][currentPixelData.y].address = currentPixelData.address;
    
        contextRef.current.fillStyle = pixelsArray[currentPixelData.x][currentPixelData.y].color;
        contextRef.current.fillRect(currentPixelData.x, currentPixelData.y, 1, 1);
    
        setPixels(pixelsArray);
        setCanvasData(pixelsArray);
      }
    });
  }, [socket, pixels, socketConnected]);

  useEffect(() => {
    if(canvasData === null) {
      setCanvasData([]);
      loadCanvas();
    }
  }, [canvasData, loadCanvas]);

  useEffect(() => {
    getData();
  }, [blockchain.account, getData]);

  useEffect(() => {
    if(notificationRef.current !== null) {
      notificationRef.current.className = 'notification';
      notificationRef.current.className = 'notification notificationAnimation';
      
      setTimeout(() => {
        if(notificationRef.current !== null) {
          notificationRef.current.className = 'notification';
          setNotification('');
        }
      }, 2450);
    }

    if(blockchainNotificationRef.current !== null) {
      blockchainNotificationRef.current.className = 'notification';
      blockchainNotificationRef.current.className = 'notification notificationAnimation';
      
      setTimeout(() => {
        if(blockchainNotificationRef.current !== null) {
          blockchainNotificationRef.current.className = 'notification';
          setNotification('');
        }
      }, 3450);
    }
  }, [blockchain.notification, notification]);

  return (
    <>
      <a href='https://painttoearn.io/' className='logo'>Paint To Earn</a>

      {paintState === true ? (
        <>
          {blockchain.account === "" || blockchain.smartContract === null ? (
            <>
              <button type='button' title='Connect Your Metamask Wallet' className={blockchain.notification === "Please install Metamask." || canvasLoaded === false ? 'connectWallet disabledButton' : 'connectWallet'} onClick={(e) => { e.preventDefault(); connectWallet(); focusOnSelectedPixel(); }}>Connect Wallet <FontAwesomeIcon icon="fa-solid fa-wallet" /></button>
            </>
          ) : (
            <>
              <div className='paintButton'>
                  <button type='button' title='Paint Selected Pixel' className={paintProcessState === false && canvasLoaded === true ? '' : 'disabledButton'} onClick={(e) => { e.preventDefault(); paint(); focusOnSelectedPixel(); }}>Paint <FontAwesomeIcon icon="fa-solid fa-brush" /></button>
              </div>
            </>
          )}
        </>
      ):(<></>)}

      <div className='socialMediaLinks'>
        <a href={'https://snowtrace.io/address/' + contractAddress} rel="noreferrer" target='_blank' className='snowtrace'> </a>
        <a href='https://twitter.com/painttoearn' rel="noreferrer" target='_blank' className='twitter'> </a>
        <a href='https://medium.com/@painttoearn' rel="noreferrer" target='_blank' className='medium'> </a>
        <button type='button' title='Informations' className={infoPopupActive === true ? "close" : "info"} onClick={(e) => { e.preventDefault(); activeInfoPopup(); focusOnSelectedPixel(); }}></button>
        <button type='button' title='Download Canvas' className={canvasLoaded === false ? 'disabledSocialMediaLink download' : 'download'} onClick={(e) => { e.preventDefault(); downloadCanvas(); }}> </button>
      </div>

      <button className={welcomePopupActive === true ? "clickToCloseWelcomePopup show" : "hide"} onClick={(e) => { e.preventDefault(); setWelcomePopupActive(false); focusOnSelectedPixel(); }}></button>
      <div className={welcomePopupActive === true ? "welcomePopup show" : "welcomePopup hide"} onClick={(e) => { e.preventDefault(); setWelcomePopupActive(false); focusOnSelectedPixel(); }}>
        <FontAwesomeIcon icon="fa-solid fa-hand-spock" />
        <h2>Welcome to Paint To Earn</h2>
        <span>
          Some have visited a canvas before. A place where togetherness created more.  
          Now, we brought it into the blockchain and  made it possible to <span className='highlight'>own your pixel </span> and <span className='highlight'>earn</span> from 
          it.
          <br/>
          It falls upon you to create a better place. 
        </span>
        <hr/>
        <h2>About Canvas</h2>
        <span>
          There is an empty canvas. You may <span className='highlight'>paint a pixel,</span> and you <span className='highlight'>own the pixel</span> and that 
          will be <span className='highlight'>registered on blockchain,</span> so you must wait to finalize the blockchain to paint another. 
          <br/><br/>
          <span className='highlight'>Individually</span> you can <span className='highlight'>create</span> something, <span className='highlight'>together</span> you can <span className='highlight'>create</span> something <span className='highlight'>more.</span>
          <br/><br/>
            For a specified time, there will be only one canvas and countdown till <span className='highlight'>the snapshot 
            date.</span> On a snapshot date, the canvas and contract will be archived, and the <span className='highlight'>creators will 
            be the owner of the Canvas.</span> Archived canvas will be listed on NFT marketplaces such as OpenSea 
            and LooksRare. If it’s sold, <span className='highlight'>proceeds will be distributed among owners.</span> 
          <br/><br/>
          <span className='highlight'>This is first time in the world; paint to earn canvas!</span>
          <hr/>
          <FontAwesomeIcon icon="fa-solid fa-rotate" />
          <h2>Stay Updated</h2>
          <span>
            We are <span className='highlight'>regularly improving and updating</span> the website and server, so we recommend you to <span className='highlight'>clear the cache</span> of your browser and (hard) <span className='highlight'>refresh</span> the page to <span className='highlight'>stay updated.</span> <span className='highlight'>Have fun!</span>
          </span>
        </span>
      </div>

      <div className='menuMobile'>
        <button type='button' title='Menu' className={menuMobileActive === true ? "menuMobileClose" : "menuMobileOpen"} onClick={(e) => { e.preventDefault(); activeMenuMobile(); focusOnSelectedPixel(); }}></button>
      </div>

      <div className={menuMobileActive === true ? "menuMobileContainer show" : "menuMobileContainer hide"}>
        <div className='menuMobileSubContainer'>
          <h2>Welcome to Paint To Earn</h2>
          <span>
            Some have visited a canvas before. A place where togetherness created more.  
            Now, we brought it into the Blockchain and  made it possible to <span className='highlightNoMarginTop'>own your pixel </span> and <span className='highlightNoMarginTop'>earn</span> from 
            it.
            <br/>
            It falls upon you to create a better place. 
          </span>
          <hr/>
          <h2>About Canvas</h2>
          <span> 
            For a specified time, there will be only one canvas and countdown till <span className='highlight'>the snapshot 
            date.</span> On a snapshot date, the canvas and contract will be archived, and the <span className='highlight'>creators will 
            be the owner of the Canvas.</span> Archived canvas will be listed on NFT marketplaces such as OpenSea 
            and LooksRare. If it’s sold, <span className='highlight'>proceeds will be distributed among owners.</span> 
          </span>
          <br/><br/>
          <span className='highlight'>This is first time in the world; paint to earn canvas!</span>
          <hr/>
          <div className='countdownMobile'>
            <Countdown countdownDays={countdownDays} countdownHours={countdownHours} countdownMinutes={countdownMinutes} countdownSeconds={countdownSeconds} />
          </div>
          <hr/>
          <h2>Controls</h2>
          <p>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Select a <span className='highlightNoMarginTop'>Pixel,</span> Choose a <span className='highlightYellow'>Color</span> and <span className='highlightNoMarginTop'>Paint</span> <br/>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Press W, A, S, D or Arrow Keys to Move <br/>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Click, Hold and Drag Mouse to Move <br/>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Scroll Mouse Wheel to Zoom <br/>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Use Zoom In, Reset & Out Buttons to Zoom <br/>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Pan to Move (on touch devices)
          </p>
          <hr/>
          <h2>Paint Price </h2>
          <span> 
            <p>{paintPrice} Avax</p>
            <span>
              ( You can buy some <span className='highlight'>Avax</span> from <a href='https://coinmarketcap.com/currencies/avalanche/markets/' rel="noreferrer" target='_blank'>here</a>. )
            </span>  
          </span>
          <hr/>
          <a className='contactUs' href='mailto:contact@painttoearn.io' rel="noreferrer" target='_blank'>Contact Us <FontAwesomeIcon icon="fa-solid fa-envelope" /></a>
          <hr/>
          <div className='socialMediaLinksMobile'>
            <a href={'https://snowtrace.io/address/' + contractAddress} rel="noreferrer" target='_blank' className='snowtrace'> </a>
            <a href='https://twitter.com/painttoearn' rel="noreferrer" target='_blank' className='twitter'> </a>
            <a href='https://medium.com/@painttoearn' rel="noreferrer" target='_blank' className='medium'> </a>
          </div>
        </div>
      </div>

      <button className={infoPopupActive === true ? "infoPopupBackground show" : "hide"} ></button>
      <div className={infoPopupActive === false ? 'infoPopup hide' : 'infoPopup show' }>
        <h2>Welcome to Paint To Earn</h2>
        <span>
          Some have visited a canvas before. A place where togetherness created more.  
          Now, we brought it into the blockchain and  made it possible to <span className='highlightNoMarginTop'>own your pixel </span> and <span className='highlightNoMarginTop'>earn</span> from 
          it.
          <br/>
          It falls upon you to create a better place. 
        </span>
        <hr/>
        <h2>About Canvas</h2>
        <span> 
          For a specified time, there will be only one canvas and countdown till <span className='highlight'>the snapshot 
          date.</span> On a snapshot date, the canvas and contract will be archived, and the <span className='highlight'>creators will 
          be the owner of the Canvas.</span> Archived canvas will be listed on NFT marketplaces such as OpenSea 
          and LooksRare. If it’s sold, <span className='highlight'>proceeds will be distributed among owners.</span> 
        </span>
        <hr/>
        <div className='countdown'>
          <Countdown countdownDays={countdownDays} countdownHours={countdownHours} countdownMinutes={countdownMinutes} countdownSeconds={countdownSeconds} />
        </div>
        <hr/>
        <h2>Controls</h2>
        <p>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Select a <span className='highlightNoMarginTop'>Pixel,</span> Choose a <span className='highlightYellow'>Color</span> and <span className='highlightNoMarginTop'>Paint</span> <br/>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Press W, A, S, D or Arrow Keys to Move <br/>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Click, Hold and Drag Mouse to Move <br/>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Scroll Mouse Wheel to Zoom <br/>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Use Zoom In, Reset & Out Buttons to Zoom <br/>
          <FontAwesomeIcon icon="fa-solid fa-caret-right" /> Pan to Move (on touch devices)
        </p>
        <hr/>
        <h2>Paint Price</h2>
        <span> 
          <p>{paintPrice} Avax</p>
          <span>
            ( You can buy some <span className='highlight'>Avax</span> from <a href='https://coinmarketcap.com/currencies/avalanche/markets/' rel="noreferrer" target='_blank'>here</a>. )
          </span>        
        </span>
        <hr/>
        <a href='mailto:contact@painttoearn.io' rel="noreferrer" target='_blank'>Contact Us <FontAwesomeIcon icon="fa-solid fa-envelope" /></a>
      </div>

      <div className={canvasLoaded === true ? 'hide': 'canvasLoading'}>
        <FontAwesomeIcon icon="fa-solid fa-circle-half-stroke" className='fa-spin'/>
        <br/>
        <span>Canvas is loading, please wait. (~10sec)</span>
      </div>

      <div className='canvasContainer' onTouchEnd={(e) => { e.preventDefault(); setEnablePanning(false); }} onTouchMove={(e) => { panningTouch(e); focusOnSelectedPixel(); }} onMouseUp={(e) => { e.preventDefault(); setEnablePanning(false); }} onMouseLeave={(e) => { e.preventDefault(); checkMouseLeave(e); }} onMouseMove={(e) => { panning(e); focusOnSelectedPixel(); }}>
        <div className={canvasLoaded === true ? 'zoomContainer': 'hide'} onTouchStart={(e) => { setCurrentTouchCoordinatesFunc(e); }} onWheel={(e) => { onScrollZoom(e); }} onMouseDown={(e) => { setCurrentMouseCoordinatesFunc(e); }} onMouseMove={(e) => { focusOnSelectedPixel(); }} style={{ width: canvasSize.width + 'px', height: canvasSize.height + 'px', transform: 'translate(' + zoomContainerTransform.x + 'px, ' + zoomContainerTransform.y + 'px) scale(' + zoomContainerTransform.scale + ')' }}>
            <div ref={selectedPixelRef} className='selectedPixel'  style={{ top: selectedPixel.top + 'px', left: selectedPixel.left + 'px' }}></div>
            <div className='grid' style={{ opacity: gridOpacity }}></div>
            <canvas className='canvas' ref={canvasRef}></canvas>
        </div>
      </div>

      <div className='zoomButtons'>
          <button type='button' title='Zoom Out' onClick={(e) => { e.preventDefault(); zoomOut(); focusOnSelectedPixel(); }}><FontAwesomeIcon icon="fa-solid fa-circle-minus" /></button>
          <button type='button' title='Zoom Reset' onClick={(e) => { e.preventDefault(); zoomReset(); focusOnSelectedPixel(); }}><FontAwesomeIcon icon="fa-solid fa-circle-dot" /></button>
          <button type='button' title='Zoom In' onClick={(e) => { e.preventDefault(); zoomIn(); focusOnSelectedPixel(); }}><FontAwesomeIcon icon="fa-solid fa-circle-plus" /></button>
      </div>

      <div className='statusMobile'> 
        <input type='tel' title='X Coordinate' min='0' max={canvasSize.width - 1} style={{ width: selectedPixelLeftInputWidth + 'rem' }} onChange={(e) => { e.preventDefault(); updateSelectedPixelLeft(e.target.value); }} value={selectedPixel.left}></input>
        ,
        <input type='tel' title='Y Coordinate' min='0' max={canvasSize.height - 1} style={{ width: selectedPixelTopInputWidth + 'rem' }} onChange={(e) => { e.preventDefault(); updateSelectedPixelTop(e.target.value); }} value={selectedPixel.top}></input>
      </div>

      <div className='status'>
        <span>Selected Pixel Painted By: <a href={'https://snowtrace.io/address/' + (pixels[0] !== undefined ? pixels[selectedPixel.left][selectedPixel.top].address : '')} className={pixels[0] !== undefined ? (pixels[selectedPixel.left][selectedPixel.top].address === '0x0000000000000000000000000000000000000000' ? 'highlight disabledLink' : 'highlight') : 'highlight disabledLink'} target='_blank' rel='noreferrer'>{pixels[0] !== undefined ? pixels[selectedPixel.left][selectedPixel.top].address.slice(0, 14) + "..." : '-' }</a></span>
        
        <span>Selected Pixel Painted Color: <span className='highlight'>{pixels[0] !== undefined ? colorPaletteItems.find(colorPaletteItem => colorPaletteItem.code === pixels[selectedPixel.left][selectedPixel.top].color).name : '-'}</span></span>
        <span>
          Selected Pixel Coordinate: 
          <input type='tel' title='X Coordinate' min='0' max={canvasSize.width - 1} className='highlight' style={{ width: selectedPixelLeftInputWidth + 'rem' }} onChange={(e) => { e.preventDefault(); updateSelectedPixelLeft(e.target.value);}} value={selectedPixel.left}></input>
          <span className='highlightNoMarginLeft'>,</span>
          <input type='tel' title='Y Coordinate' min='0' max={canvasSize.height - 1} className='highlight' style={{ width: selectedPixelTopInputWidth + 'rem' }} onChange={(e) => { e.preventDefault(); updateSelectedPixelTop(e.target.value);}} value={selectedPixel.top}></input>
        </span>
        <span>Paint Color: <span className='highlight'>{ colorPaletteItems.find(colorPaletteItem => colorPaletteItem.code === paintColor).name}</span></span>
      </div>

      <div className='colorPalette'>
        {colorPaletteItems.map((colorPaletteItem, index) => (
          <button key={'colorPaletteItem' + index} style={{background : colorPaletteItem.code}} className={paintColor === colorPaletteItem.code ? 'colorPaletteItem selectedColorPaletteItem' : 'colorPaletteItem'} onClick={(e) => { e.preventDefault(); setPaintColor(colorPaletteItem.code); focusOnSelectedPixel(); }}></button>
        ))}
      </div>

      {notification !== "" ? (
        <div ref={notificationRef} className='notification'><FontAwesomeIcon icon="fa-solid fa-circle-info" /> {notification}</div>
      ) : (<></>)}
      
      {blockchain.notification !== "" ? (
        <div ref={blockchainNotificationRef} className='notification'><FontAwesomeIcon icon="fa-solid fa-circle-info" /> {blockchain.notification}</div>
      ) : (<></>)}

      <div className='copyright'>© Secred Lab 2022 - All rights reserved.</div>

    </>
  )
}

export default App;
