import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import { motion } from 'framer-motion/dist/framer-motion';
import { Link } from "react-scroll";
import env from "react-dotenv";

import FAQ from '../components/faq.js';
import Countdown from '../components/countdown.js';
import Symbols from '../components/symbols.js';

function Home() {

    // Mobile Menu --------------------------------------------------

    const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuAnimation = {
        open: { opacity: 1, transition: { duration: 0.25 } },
        close: { opacity: 0, transition: { duration: 0.25 } }
    };

    function toggleMenu() {
        if(mobileMenuOpened) {
            setMobileMenuOpen(false);
            setTimeout(() => {
                document.body.style.overflowY = "overlay";
                setMobileMenuOpened(false);  
            }, 250);

        } else {
            document.body.style.overflowY = "hidden";
            setMobileMenuOpened(true); 
            setMobileMenuOpen(true);   
        }
    };

    // Symbols --------------------------------------------------

    const [symbolIndex, setSymbolIndex] = useState(0);
    const [symbolImage, setSymbolImage] = useState("media/symbols/Aqirheed.svg");
    const [symbolName, setSymbolName] = useState("Aqirheed");
    const [symbolRarity, setSymbolRarity] = useState("Common");
    const [symbolDesc, setSymbolDesc] = useState("You know there's always a second way. That's why you're here. Glad you are with us.");
    const [symbolChanged, setSymbolChanged] = useState(false);

    let symbols = [
        {name : "Aqirheed", desc : "You know there's always a second way. That's why you're here. Glad you are with us.", rarity : "Common", image : "media/symbols/Aqirheed.svg"},
        {name : "Decnae", desc : "You are the most active person in society and exploring different paths. Think different.", rarity : "Common", image : "media/symbols/Decnae.svg"},
        {name : "Dhota", desc : "You are the one who sees that everything is strange. Because you know it's a simulation and your biggest passion is to get out of here.", rarity : "Common", image : "media/symbols/Dhota.svg"},
        {name : "Gonehu", desc : "You like to leave a mark in everything you do, that's why you're here. We need your ideas.", rarity : "Common", image : "media/symbols/Gonehu.svg"},
        {name : "Isin", desc : "You are the one looking for the way out and you are in the right place. We will all get out of here together. We need your strength, all or none of us.", rarity : "Common", image : "media/symbols/Isin.svg"},
        {name : "Phulanan", desc : "You know the way out, jump in and join us. Because you know how to have fun.", rarity : "Common", image : "media/symbols/Phulanan.svg"},
        {name : "Shiglid", desc : "Everything is taking that first step... You are strong enough to take that step and that's why you're here.", rarity : "Rare", image : "media/symbols/Shiglid.svg"},
        {name : "Yezze", desc : "We hear the voice within. You are here to start the movement. We need you, don't go anywhere.", rarity : "Rare", image : "media/symbols/Yezze.svg"},
        {name : "Zessoz", desc : "We know that you are tired of being a spectator in this simulation and we invite you to the game. Come on, stand up!", rarity : "Rare", image : "media/symbols/Zessoz.svg"},
        {name : "Actan", desc : "You have the power that holds everyone together. That's why you're here.", rarity : "Epic", image : "media/symbols/Actan.svg"},
        {name : "Bukuan", desc : "You are the strength here. We need your strength of solidarity. Don't go anywhere.", rarity : "Epic", image : "media/symbols/Bukuan.svg"},
        {name : "Imoth", desc : "We need your thoughts to be sustainable. Think to get out of here and help us.", rarity : "Epic", image : "media/symbols/Imoth.svg"},
        {name : "Gaiguine", desc : "You are the beginning of the new world, everything you produce is the first step of innovation. You're so special, glad you're here.", rarity : "Legend", image : "media/symbols/Gaiguine.svg"},
        {name : "Ghebba", desc : "You have infinite talent. The key to exit this simulation is in your hands. We need this.", rarity : "Legend", image : "media/symbols/Ghebba.svg"},
        {name : "Wrevonit", desc : "There is nothing you cannot overcome with your intelligence, you have the way out of this simulation. Help with us.", rarity : "Legend", image : "media/symbols/Wrevonit.svg"},
    ]

    function changePrevSymbol() {
        setSymbolChanged(true);
        setTimeout(() => {
            let currentSymbolIndex = symbolIndex;
            if(currentSymbolIndex >= 1){
                currentSymbolIndex--;
                setSymbolIndex(currentSymbolIndex);
            } else {
                currentSymbolIndex = 14;
                setSymbolIndex(currentSymbolIndex);
            }
            setSymbolImage(symbols[currentSymbolIndex].image);
            setSymbolName(symbols[currentSymbolIndex].name);
            setSymbolRarity(symbols[currentSymbolIndex].rarity);
            setSymbolDesc(symbols[currentSymbolIndex].desc);
            setSymbolChanged(false);
        }, 250);
    };

    function changeNextSymbol() {
        setSymbolChanged(true);
        setTimeout(() => {
            let currentSymbolIndex = symbolIndex;
            if(currentSymbolIndex <= 13){
                currentSymbolIndex++;
                setSymbolIndex(currentSymbolIndex);
            } else {
                currentSymbolIndex = 0;
                setSymbolIndex(currentSymbolIndex);
            }
            setSymbolImage(symbols[currentSymbolIndex].image);
            setSymbolName(symbols[currentSymbolIndex].name);
            setSymbolRarity(symbols[currentSymbolIndex].rarity);
            setSymbolDesc(symbols[currentSymbolIndex].desc);
            setSymbolChanged(false);
        }, 250);
    };  

    // FAQ Accordion --------------------------------------------------

    const [faqs, setFaqs] = useState([
        {
            question: "What is Simulacra Society?",
            answer: "The Simulacra Society is an ecosystem that provides value to our community's projects. In addition to a worldwide commercial license, all Simulacra's NFT holders will have access to our community created projects including collaborative and future in the Simulacra World. It is a society where creators and collectors are all together and support each other's ideas and projects to survive in the new world of Web3.",
            open: false
        },
        {
            question: "What is the concept of simulacra?",
            answer: "SIMULACRUM (simulacra): Something that replaces reality with its representation. Jean Baudrillard in \"The Precession of Simulacra\" defines this term as follows: \"Simulation is no longer that of a territory, a referential being, or a substance. It is the generation by models of a real without origin or reality: a hyperreal... It is no longer a question of imitation, nor duplication, nor even parody. It is a question of substituting the signs of the real for the real\" (1-2). His primary examples are psychosomatic illness, Disneyland, and Watergate. Fredric Jameson provides a similar definition: the simulacrum's \"peculiar function lies in what Sartre would have called the derealization of the whole surrounding world of everyday reality\".",
            open: false
        },
        {
            question: "Where did Simulacra Society come from?",
            answer: "It came from the book called Simulacra & Simulation.  The publication of “Simulacra et Simulation” by  in 1981 marked Jean Baudrillard's first important step toward theorizing the postmodern. Baudrillard uses the concepts of the simulacra—the copy without an original—and simulation. These terms are crucial to an understanding of the postmodern, to the extent that they address the concept of mass reproduction and reproducibility that characterizes our electronic media culture. Baudrillard's book represents a unique and original effort to rethink cultural theory from the perspective of a new concept of cultural materialism, one that radically redefines postmodern formulations of the body. So do we. Join Us.",
            open: false
        },
        {
            question: "What is needed to have an Incubation Pod NFT?",
            answer: "Spirit, consciousness, creativity are what you’ll need to survive in this world. Simulacra Society is open to creative thinkers and wants to exit from nonexistence. Join our society, explore decentralized governance with us.  Our society consists of created humans who are virtually hardwired into becoming part of the Web 3.0 World and virtually integrated into the new way of life. However, Simulacra Society is open to everyone, regardless of experience or background. Join our fearless journey as we explore Web3.0, DAOs, NFT, decentralized colonization and governance. We will colonize and create our own world. Or just come for the memes & community.",
            open: false
        },
        {
            question: "What is in it for me as a Creator?",
            answer: "If you are a creative person who  wants to jump into the NFT and  Web3 space. We as a team are here for you. If you have a unique Simulacra Incubation Pod you can submit your project to the community and we are going to help you to achieve your project and get out of this simulation and you’ll get your freedom.",
            open: false
        },
        {
            question: "What is in it for me as a Collector / Investor ?",
            answer: "If you are a collector who wants early access to new global born creative projects  you are in the right place. Why you are in right place? However, Simulacra Society is open to everyone, regardless of experience or background,  Our Genesis incubation pods collection is open to primarily to creators and there will be several projects in the society that will be initiated by them. So Society NFT owners will have voting rights and early access to whitelists in coming projects.",
            open: false
        },
    ]);

    const toggleFAQ = index => {
        setFaqs(faqs.map((faq, i) => {
            if (i === index) {
                faq.open = !faq.open;
            } else {
                faq.open = false;
            }

            return faq;
        }));
    }

    // Countdown --------------------------------------------------

    const [countdownDays, setCountdownDays] = useState(0);
    const [countdownHours, setCountdownHours] = useState(0);
    const [countdownMinutes, setCountdownMinutes] = useState(0);
    const [countdownSeconds, setCountdownSeconds] = useState(0);

    let intervalCountdown;

    const startCountdown = () => {
        let countdownDate = new Date("May 28, 2022 15:48:1").getTime();
        
        intervalCountdown = setInterval(() => {
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

    const stopCountdown = () => {
        clearInterval(intervalCountdown);
    };

    // Blockchain --------------------------------------------------

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
  
    const [notification, setNotification] = useState(``);
  
    const [mintSystemActivated, setMintSystemActivated] = useState(false);
  
    const [whitelistCountdownActivated, setWhitelistCountdownActivated] = useState(false);
    const [whitelistCountdownFinished, setWhitelistCountdownFinished] = useState(false);
    const [whitelistMintActivated, setWhitelistMintActivated] = useState(false);
  
    const [mintActivated, setMintActivated] = useState(false);
  
    const [mintState, setMintState] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
  
    const [whitelistMintState, setWhitelistMintState] = useState(false);
    const [whitelistMintAmount, setWhitelistMintAmount] = useState(1);
  
    const name = "Incubation Pod";
    const contractAddress = "0x0000000000000000000000000000000000000000";
    const weiCost = "25000000000000000";
    const baseGasLimit = "285000";
  
    //const whitelistAddresses = JSON.parse(env.Whitelist_Addresses);
  
    //Default Mint --------------------------------------------------
    
    const mint = () => {
      let cost = weiCost;
      let gasLimit = baseGasLimit;
      let totalCostWei = String(cost * mintAmount);
      let totalGasLimit = String(gasLimit * mintAmount);
  
      setNotification(`Minting...`);
      setMintState(true);
  
      blockchain.smartContract.methods.mint(mintAmount).send({
        gasLimit: String(totalGasLimit),
        to: contractAddress,
        from: blockchain.account,
        value: totalCostWei,
  
      }).once("error", (err) => {
        if(err.message == "MetaMask Tx Signature: User denied transaction signature."){
          setNotification("User denied transaction signature.");
        } else {
          setNotification(err.message);
        }
        setMintState(false);
  
      }).then((receipt) => {
        setNotification("Successfully minted.");
        setMintState(false);
        dispatch(fetchData(blockchain.account));
  
      });
    };
  
    const decrementMintAmount = () => {
      let newMintAmount = mintAmount - 1;
      if (newMintAmount < 1) {
        newMintAmount = 1;
      }
      setMintAmount(newMintAmount);
    };
  
    const incrementMintAmount = () => {
      let newMintAmount = mintAmount + 1;
      if (newMintAmount > 10) {
        newMintAmount = 10;
      }
      setMintAmount(newMintAmount);
    };
  
    //Whitelist Mint --------------------------------------------------
  
    const whitelistMint = () => {
    //   let cost = weiCost;
    //   let gasLimit = baseGasLimit;
    //   let totalCostWei = String(cost * mintAmount);
    //   let totalGasLimit = String(gasLimit * mintAmount);
  
    //   setNotification(`Minting...`);
    //   setWhitelistMintState(true);
  
    //   const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    //   const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
    //   let currentAccountAddress = Web3.utils.toChecksumAddress(blockchain.account).toString();
  
    //   if(whitelistAddresses.findIndex((address) => address == currentAccountAddress) == -1) {
  
    //     setNotification("Address is not in the whitelist.");
    //     setWhitelistMintState(false);
    //     dispatch(fetchData(blockchain.account));
  
    //   } else {
  
    //     let claimingAddress = leafNodes[whitelistAddresses.findIndex((address) => address == currentAccountAddress)];
    //     let hexProof = merkleTree.getHexProof(claimingAddress);
  
    //     blockchain.smartContract.methods.whitelistMint(mintAmount, hexProof).send({
    //       gasLimit: String(totalGasLimit),
    //       to: contractAddress,
    //       from: blockchain.account,
    //       value: totalCostWei,
  
    //     }).once("error", (err) => {
    //       if(err.message == "MetaMask Tx Signature: User denied transaction signature."){
    //         setNotification("User denied transaction signature.");
    //       } else {
    //         setNotification(err.message);
    //       }
    //       setWhitelistMintState(false);
  
    //     }).then((receipt) => {
    //       setNotification("Successfully minted.");
    //       setWhitelistMintState(false);
    //       dispatch(fetchData(blockchain.account));
    //     });
    //   }
    };
  
    const decrementWhitelistMintAmount = () => {
      let newWhitelistMintAmount = whitelistMintAmount - 1;
      if (newWhitelistMintAmount < 1) {
        newWhitelistMintAmount = 1;
      }
      setWhitelistMintAmount(newWhitelistMintAmount);
    };
  
    const incrementWhitelistMintAmount = () => {
      let newWhitelistMintAmount = whitelistMintAmount + 1;
      if (newWhitelistMintAmount > 10) {
        newWhitelistMintAmount = 10;
      }
      setWhitelistMintAmount(newWhitelistMintAmount);
    };
  
    //Smart Contract Data --------------------------------------------------
  
    const getData = () => {
      if (blockchain.account !== "" && blockchain.smartContract !== null) {
        dispatch(fetchData(blockchain.account));
      }
    };
  
    //Subscribe to Newsletter --------------------------------------------------
  
    const [subscribeEmail, setSubscribeEmail] = useState('');

    const submitSubscribeEmail = (e) => {
        e.preventDefault();
        fetch(`https://simulacrasociety.io/server/memberAdd?email=${subscribeEmail}`)
        .then(res => res.json());
        setSubscribeEmail('');
        e.target.reset();
    }

    useEffect(() => {
        getData();

        //Mint System Activated --------------------------------------------------
    
        if(mintSystemActivated == false) {
            document.getElementsByClassName("home-section")[0].style.marginTop = "12rem";
            if(document.getElementsByClassName("nextSectionArrow")[0] !== undefined) {
                document.getElementsByClassName("nextSectionArrow")[0].style.display = "block";
            }
        } else {
            document.getElementsByClassName("home-section")[0].style.marginTop = "6rem";
            if(document.getElementsByClassName("nextSectionArrow")[0] !== undefined) {
                document.getElementsByClassName("nextSectionArrow")[0].style.display = "none";
            }
        }

        //Countdown --------------------------------------------------
  
        if(whitelistCountdownActivated == true) {
            startCountdown();
        } else {
            stopCountdown();
        }

        //Pre Load Symbols --------------------------------------------------

        symbols.forEach((symbol) => {
            const img = new Image();
            img.src = symbol.image;
        });
    
    }, [blockchain.account]);

    return (
        <React.Fragment>
            <motion.div key="homePage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ease: "easeInOut", duration: 1 }}>
                <div className="wrapper">
                    
                    <div data-aos="fade-down" className="menubarcontainer">
                        <a className="logo" href="/">
                            <img src="/media/icons/simulacra_society_logo.svg"/>
                        </a>
                        <div className="menubar">
                            <Link to="about" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons">About</Link>
                            <Link to="roadmap" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons">Roadmap</Link>
                            <Link to="faq" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons">FAQ</Link>
                            <Link to="team" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons">Team</Link>
                        </div>
                        <div className="socialmenubar">
                            <a className="socialmenubuttons" href="https://opensea.io/SimulacraSociety" target="_blank"><div className="openSeaIcon"></div></a>
                            <a className="socialmenubuttons" href="https://twitter.com/simulacranft" target="_blank"><div className="twitterIcon"></div></a>
                            <a className="socialmenubuttons" href="https://www.instagram.com/simulacrasociety/" target="_blank"><div className="instagramIcon"></div></a>
                            <a className="socialmenubuttons" href="https://www.linkedin.com/company/simulacrasociety/" target="_blank"><div className="linkedinIcon"></div></a>
                        </div>
                    </div>
                    <button data-aos="fade-down" className="menubutton-mobile" onClick={(e) => { e.preventDefault(); toggleMenu(); }}><i className="fas fa-bars"></i></button>
                    <button className={"menubutton-mobile-close " + (mobileMenuOpen ? 'displayBlock' : 'displayNone')} onClick={(e) => { e.preventDefault(); toggleMenu(); }}><i className="fa-solid fa-xmark"></i></button>
                    <motion.div variants={menuAnimation} animate={mobileMenuOpen ? 'open' : 'close'} className={"menubarcontainer-mobile " + (mobileMenuOpened ? 'displayBlock' : 'displayNone')}>
                        <ul className="menubar-mobile">
                            <Link to="about" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>About</Link>
                            <Link to="roadmap" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>Roadmap</Link>
                            <Link to="faq" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>FAQ</Link>
                            <Link to="team" spy={true} smooth={true} offset={-60} duration={900} className="menubuttons" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>Team</Link>
                        </ul>
                        <div className="socialmenubar-mobile">
                            <a className="socialmenubuttons" href="https://opensea.io/SimulacraSociety" target="_blank"><div className="openSeaIcon"></div></a>
                            <a className="socialmenubuttons" href="https://twitter.com/simulacranft" target="_blank"><div className="twitterIcon"></div></a>
                            <a className="socialmenubuttons" href="https://www.instagram.com/simulacrasociety/" target="_blank"><div className="instagramIcon"></div></a>
                            <a className="socialmenubuttons" href="https://www.linkedin.com/company/simulacrasociety/" target="_blank"><div className="linkedinIcon"></div></a>
                        </div>
                    </motion.div>

                    <section className="home-section" id="home">
                        <img className="blobs blob1" src="/media/blobs/blob1.webp"/>
                        <img data-aos="zoom-in" className="incubationPodImage" src="/media/incubationPod/incubationPodHigh.webp"/>
                        <h1 data-aos="fade-up" data-aos-delay="100">Hello, Simulacra!</h1>
                        <h2 data-aos="fade-up" data-aos-delay="150" className="highlighted">Here is the exit from nonexistence.</h2>
                        <p data-aos="fade-up" data-aos-delay="200">Are you ready to meet people like you and build a new world together?</p>
                        <div className="joinWhitelist" data-aos="fade-up" data-aos-delay="150">
                            <a className="default-button " href="https://forms.gle/7cuRJUEZHjhXHR5p6" target="_blank">Join The Whitelist <i className="fa-solid fa-file-signature"></i></a>
                        </div>
                        <div data-aos="fade" data-aos-delay="300">
                            {mintSystemActivated === true ? (
                                <>
                                {whitelistCountdownActivated === true ? (
                                    <>
                                    <div className="countdown">
                                        <div>Whitelist Mint will start in</div>
                                        {<Countdown countdownDays={countdownDays} countdownHours={countdownHours} countdownMinutes={countdownMinutes} countdownSeconds={countdownSeconds} />}
                                    </div>
                                    </>
                                ) : (
                                    <>
                                    <div className="mintdiv">
                                        {Number(data.totalSupply) >= blockchain.maxMintAmount ? (
                                        <>
                                            <p className="soldOut"> Sold out. </p>
                                        </>
                                        ) : (
                                        <>
                                            {blockchain.account === "" || blockchain.smartContract === null ? (
                                            <>
                                                <button className="default-button margintop8rem" onClick={(e) => { e.preventDefault(); dispatch(connect()); getData(); }}>Connect Wallet <i className="fa-solid fa-wallet"></i></button>
                                                {blockchain.errorNotification !== "" ? (<> <div className="errorNotification"> <span>{blockchain.errorNotification}</span> </div> </>) : null}
                                            </>
                                            ) : (
                                            <>
                                                {whitelistCountdownFinished === true ? (
                                                <>
                                                    <div className="waitForMint">
                                                        <span>Whitelist Mint will be available soon.</span>
                                                    </div>
                                                </>
                                                ) : (
                                                <>
                                                    {whitelistMintActivated === true ? (
                                                    <>
                                                        <p className="mintedItemCount"> {data.totalSupply} / {data.maxSupply} Minted</p>
                                                        <p className="mintCost">1 {name} costs {Web3.utils.fromWei(String(data.mintPrice), 'ether')}{" "} Eth</p>
                                                        <div className="mintincreasebuttons">
                                                        <button className="small-button" onClick={(e) => { e.preventDefault(); decrementWhitelistMintAmount(); }} disabled={whitelistMintState ? 1 : 0}> - </button>
                                                        <span>{whitelistMintAmount}</span>
                                                        <button className="small-button" onClick={(e) => { e.preventDefault(); incrementWhitelistMintAmount(); }} disabled={whitelistMintState ? 1 : 0}> + </button>
                                                        </div>
                                                        <button className="default-button" onClick={(e) => { e.preventDefault(); whitelistMint(); getData(); }} disabled={whitelistMintState ? 1 : 0}>Whitelist Mint</button>
                                                        <div className="notification">
                                                        <span>{notification}</span>
                                                        </div>
                                                    </>
                                                    ) : (
                                                    <>
                                                        {mintActivated === true ? (
                                                        <>
                                                            <p className="mintedItemCount"> {data.totalSupply} / {data.maxSupply} Minted</p>
                                                            <p className="mintCost">1 {name} costs {Web3.utils.fromWei(String(data.mintPrice), 'ether')}{" "} Eth</p>
                                                            <div className="mintincreasebuttons">
                                                            <button className="small-button" onClick={(e) => { e.preventDefault(); decrementMintAmount(); }} disabled={mintState ? 1 : 0}> - </button>
                                                            <span>{mintAmount}</span>
                                                            <button className="small-button" onClick={(e) => { e.preventDefault(); incrementMintAmount(); }} disabled={mintState ? 1 : 0}> + </button>
                                                            </div>
                                                            <button className="default-button" onClick={(e) => { e.preventDefault(); mint(); getData(); }} disabled={mintState ? 1 : 0}>Mint</button>
                                                            <div className="notification">
                                                            <span>{notification}</span>
                                                            </div>
                                                        </>
                                                        ) : (
                                                        <>
                                                            <div className="waitForMint">
                                                            <span>Mint will be available soon.</span>
                                                            </div>
                                                        </>
                                                        )}
                                                    </>
                                                    )}
                                                </>
                                                )}                    
                                            </>
                                            )}
                                        </>
                                        )}
                                    </div>
                                    </>
                                )}
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </section>
                    
                    <section className="quote-section">
                        <p data-aos="fade-up">
                            “The simulacrum is never that which conceals the truth — it is the truth <br/>
                            which conceals that there is none. The simulacrum is true.” -Ecclesiastes
                        </p>
                    </section>

                    <section className="about-section" id="about">
                        <img className="blobs blob2" src="/media/blobs/blob2.webp"/>
                        <div className="aboutcontent">
                            <div className="aboutinfo">
                                <h2 data-aos="fade-up">About The Project</h2>
                                <h3 data-aos="fade-up" data-aos-delay="100"><i className="fa-solid fa-angle-right"></i> What is Simulacra Society?</h3>
                                <p data-aos="fade-up" data-aos-delay="150" id="aboutTheProjectP">
                                    The Simulacra Society is an ecosystem that provides value to our community's projects. In addition to a worldwide commercial license, 
                                    all Simulacra's NFT holders will have access to our community created projects including collaborative and future in the Simulacra World.    
                                </p>
                                <br/>
                                <h3 data-aos="fade-up" data-aos-delay="200"><i className="fa-solid fa-leaf"></i> How does our ecosystem work?</h3>
                                <p data-aos="fade-up" data-aos-delay="250" id="ecosystemWork">
                                    The announcement of the first Simulacra Society project will start with the incubation period. Each user who joins the project and mint an NFT will receive an incubation pod.  
                                    A pod with  a virtual metababy inside which represents our creativity and hidden power of ourselves. In total there will be 7777 incubation pods in the genesis collection. 
                                    <br/><br/>
                                    Spirit, consciousness, creativity are what you’ll need to survive in this world. Simulacra Society is open to creative thinkers and wants to exit from nonexistence. Join our society, explore decentralized governance with us.
                                </p>
                                <div data-aos="fade-up" data-aos-delay="300"><a className="default-button" href="https://twitter.com/simulacranft" target="_blank">Follow on Twitter <i className="fab fa-twitter"></i></a></div>
                            </div>
                            <iframe data-aos="fade" data-aos-delay="100" className="aboutvideo" src="https://www.youtube.com/embed/KJGYGwHml2A" srcDoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;height:100%;object-fit:cover;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style>
                                <a href=https://www.youtube.com/embed/KJGYGwHml2A?vq=hd2880p&modestbranding=1&autohide=1&showinfo=0&rel=0><img src=https://img.youtube.com/vi/KJGYGwHml2A/maxresdefault.jpg><span>▶</span></a>
                                "frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                            </iframe>
                        </div>
                    </section>

                    <section className="manifest-section">
                        <img className="blobs blob3" src="/media/blobs/blob3.webp"/>
                        <div className="manifestdiv">
                            <h2 data-aos="fade-up">Manifest</h2>
                            <p data-aos="fade-up" data-aos-delay="100">
                                We were all very used to this eternal silence… <br/>
                                <span className="highlighted">A deep silence…</span> <br/><br/>
                                We adapted to everything with ease, it was easy to accept everything, and we were happy about it. 
                                We had left behind that absolute existence we felt inside. We had bowed down to the order, to everything that was asked of us. <br/>
                                Yet a voice inside us told us that this was not right, but we kept snoozing its call every night, then went to sleep in a plastic peace. 
                                Maybe that was the reason we were sleep-deprived for many days. <span className="highlighted">We were tired and knocked out</span> while we tried to make our voices heard to ourselves. We were fulfilling the tasks the world had given us. <br/><br/>
                                Perhaps <span className="highlighted">we were living in a pod...</span> The endowed ones we felt safe in. Or perhaps each of us was already in a different pod, different looking but similar. 
                                In a tiny world whose shells wrapped around us, thinking about the dangers that would never harm us. <br/><br/>
                                <span className="highlighted">Now it's time to wake up!</span> Time to leave everything behind we've been told and dictated to break down the pod and face reality… 
                                Time finds them, gets them what they deserve and celebrates their existence. <span className="highlighted">We all are heroes.</span> Brave enough to change the world, sarcastic enough to dare to perish, amusing to show here we are… 
                            </p>
                        </div>
                    </section>

                    <section className="pods-section">
                        <img className="blobs blob8" src="/media/blobs/blob8.webp"/>
                        <img className="blobs blob9" src="/media/blobs/blob9.webp"/>
                        <div className="podsinfo podsinfo1">
                            <h2 data-aos="fade-up">INCUBATION PODS</h2>
                            <p data-aos="fade-up" data-aos-delay="100">
                                Each user who has joined the project and mint will receive an Incubation Pod which grants a vital secret power. <br/>
                                As for the rest of the story, it will be created by you, the Simulacra Incubation pod  NFT holders. <br/> 
                                In total there will be 7777 incubation pods in the genesis collection.
                            </p>
                            <h3 data-aos="fade-up" data-aos-delay="150"><i className="fa-solid fa-angle-right"></i>INCUBATION POD’S UTILITY - What is it?</h3>
                        </div>
                        <ul className="podsUtility">
                            <li data-aos="fade-up" data-aos-delay="200" className="podsUtility1">
                                <img src="/media/utilities/societyMembership.webp"/>
                                <div>
                                    <h4>SOCIETY MEMBERSHIP</h4>
                                    <p>
                                        Each pod is not only an awesome fine art JPEG, it’s also an exclusive membership card that allows access to members-only benefits which will be revealed over time.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="250" className="podsUtility2">
                                <img src="/media/utilities/ipRights.webp"/>
                                <div>
                                    <h4>IP RIGHTS</h4>
                                    <p>
                                        Each pod is an NFT and all ownership and usage rights of the NFT’s are given to NFT Holders.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="300" className="podsUtility3">
                                <img src="/media/utilities/privateAccess.webp"/>
                                <div>
                                    <h4>PRIVATE ACCESS</h4>
                                    <p>
                                        Each NFT owner will have private access to Society (Private/Secret Telegram Group / Discord Channel  (about NFT, Crypto, Blockchain and new opportunities) 
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="350" className="podsUtility4">
                                <img src="/media/utilities/votingRightInSociety.webp"/>
                                <div>
                                    <h4>VOTING RIGHT IN SOCIETY</h4>
                                    <p>
                                        Each NFT owner will have an equal right to vote in the Society to select the next project and support the community.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="400" className="podsUtility5">
                            <img src="/media/utilities/creatingFacility.webp"/>
                                <div>
                                    <h4>CREATING FACILITY</h4>
                                    <p>
                                        Each NFT has a specific rarity and value and some of them give you a specific opportunity to create your own NFT project and we support you as a society. (please see hatching part)
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div className="podsinfo podsinfo2">
                            <h3 data-aos="fade-up" data-aos-delay="100"><i className="fa-solid fa-angle-right"></i> SYMBOLS ON PODS</h3>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="100" className="symbols">
                            {<Symbols key={symbolName} symbolChanged={symbolChanged} symbolImage={symbolImage} symbolName={symbolName} symbolRarity={symbolRarity} symbolDesc={symbolDesc} />}
                            <div>
                                <button className="small-button" onClick={(e) => { e.preventDefault(); changePrevSymbol(); }}><i className="fa-solid fa-caret-left"></i></button>
                                <button className="small-button" onClick={(e) => { e.preventDefault(); changeNextSymbol(); }}><i className="fa-solid fa-caret-right"></i></button>
                            </div>
                        </div>
                        <div className="podsinfo podsinfo3">
                            <h3 data-aos="fade-up"><i className="fa-solid fa-angle-right"></i> MASTERS  &  HATCHING & 101 SIMULACRA</h3>
                            <h4 data-aos="fade-up" data-aos-delay="100"><i className="fa-solid fa-user-large"></i> Who is the MASTER and what can you do as a Master ?</h4>
                            <p data-aos="fade-up" data-aos-delay="150">
                                There will be high rarity legend NFTs in 7,777 incubation pods. <br/>
                                Owners of these legend NFTs with highest 77 rarity will have the title/badge “Master” and will have their own incubation pod trees. There will be 77 trees in total, each containing 101 pods.
                            </p>
                            <div data-aos="fade-up" data-aos-delay="200" className='mastersDiv'>
                                <img src="/media/masters/rare.webp"/>
                                Get one of the 77 highest rarity NFT and submit your project to the community. We will support your project with marketing and technical solutions.
                            </div>
                            <div data-aos="fade-up" data-aos-delay="250" className='mastersDiv'>
                                <img src="/media/masters/symbols.webp"/>
                                Don't worry if you haven't got any of the Master NFT's. You can still submit your project if you have some high rarity symbols on your simulacra incubation pods. This opportunity will be limited to first 24 wallet/person and with first come first serve basis.
                            </div>
                            <div data-aos="fade-up" data-aos-delay="300" className='mastersDiv'>
                                <img src="/media/masters/pod.webp"/>
                                These people we identify as "101 SIMULACRA" will have the chance to be called "Master" in their future project(s).
                            </div>
                        </div>
                        <div className="podsinfo podsinfo4">
                            <h3 data-aos="fade-up" data-aos-delay="100"><i className="fa-solid fa-angle-right"></i> DECENTRALIZED COLONIZATION</h3>
                            <p data-aos="fade-up" data-aos-delay="150">
                                The total 7777 people in the 77 trees we own have priorities in every project we will do and <br/>
                                work as a "SIMUFOLKS" for the project's evolution. 
                                <br/><br/>
                                <span className="highlighted">And so, decentralized colonization will begin.</span>
                            </p>
                        </div>
                        <div className="podsinfo podsinfo5">
                            <h3 data-aos="fade-up" data-aos-delay="100"><i className="fa-solid fa-angle-right"></i> MINTING </h3>
                            <p data-aos="fade-up" data-aos-delay="150">
                                We believe in community, and we believe in creators and early adopters. <br/>
                                So there  will be special  whitelist  spots for creators and several partners in the NFT community. <br/>
                                We believe early adopters and want them rewarded, so the Mint Price will start 0.035ETH, <br/>
                                but each 777 sold price will be increased by 7% in the next drop. <br/>
                                For right clickers,  JPEGs are always free ;)
                            </p>
                        </div>
                    </section>

                    <section className="roadmap-section" id="roadmap">
                        <img className="blobs blob4" src="/media/blobs/blob4.webp"/>
                        <div className="roadmapinfo">
                            <h2 data-aos="fade-up">Roadmap</h2>
                        </div>
                        <div>
                            <ul className="roadmaplist roadmaplist1">
                                <li data-aos="fade-up" data-aos-delay="100" className="roadmaplistitem" id="roadmaplist1">
                                    <span>Q1 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem completed">Web page launch <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem completed">Smart contact development <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem completed">Program for collection creators <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem ongoing">Community building and partnerships</li>
                                    </ul>
                                    <li data-aos="fade-up" data-aos-delay="200" className="roadmaplistitem" id="roadmaplist3">
                                        <span>Q3 2022</span>
                                        <ul className="roadmaplistitemsublist">
                                            <li className="roadmaplistitemsublistitem">Token launch & Airdrop to NFT holders</li>
                                            <li className="roadmaplistitemsublistitem">IDO &  Public Sale</li>
                                            <li className="roadmaplistitemsublistitem">Token Trading & Farming</li>
                                        </ul>
                                    </li>
                                    <li data-aos="fade-up" data-aos-delay="250" className="roadmaplistitem" id="roadmaplist4">
                                        <span>Q4 2022</span>
                                        <ul className="roadmaplistitemsublist">
                                            <li className="roadmaplistitemsublistitem">NFT launchpad: Launch platform for other creators</li>
                                            <li className="roadmaplistitemsublistitem">NFT Marketplace Launch</li>
                                            <li className="roadmaplistitemsublistitem">Continuous Support Mechanism to Creators</li>
                                        </ul>
                                    </li>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="150" className="roadmaplistitem" id="roadmaplist2">
                                    <span>Q2 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem">Minting of Genesis pods & hatching period
                                            <ul className="roadmaplistitemsublistsublist">
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist1">
                                                    <p>(7% Minted) Raffle to 7 NFT to the lucky NFT owners in the society.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist2">
                                                    <p>(21% Minted) Society’s Treasury created & Raffle to 21 NFT to the NFT owners in the society</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist3">
                                                    <p>(49% Minted) Opening a specific and secret communication channel for NFT holders / Members only discord initiated.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist4">
                                                    <p>(77% Minted) 77 randomly-selected participants in the Public Sale will receive a surprise physical Merchandise.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist5">
                                                    <p>(99% Minted) Voting will begin for the next project to be selected from among The Simulacra Masters.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist6">
                                                    <p>(100% Minted) 1 ETH raffle to the holder. And so, decentralized colonization Waiting the next project.</p>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="roadmaplistitemsublistitem">Accepting new project proposals from Creators and NFT owners</li>
                                        <li className="roadmaplistitemsublistitem">Support to the new projects</li>
                                    </ul>
                                </li>
                            </ul>
                            <ul className="roadmaplist roadmaplist2">
                                <li data-aos="fade-up" data-aos-delay="100" className="roadmaplistitem" id="roadmaplist1">
                                    <span>Q1 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem completed">Web page launch <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem completed">Smart contact development <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem completed">Program for collection creators <i className="fas fa-check"></i></li>
                                        <li className="roadmaplistitemsublistitem ongoing">Community building and partnerships</li>
                                    </ul>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="150" className="roadmaplistitem" id="roadmaplist2">
                                    <span>Q2 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem">Minting of Genesis pods & hatching period
                                            <ul className="roadmaplistitemsublistsublist">
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist1">
                                                    <p>(7% Minted) Raffle to 7 NFT to the lucky NFT owners in the society.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist2">
                                                    <p>(21% Minted) Society’s Treasury created & Raffle to 21 NFT to the NFT owners in the society</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist3">
                                                    <p>(49% Minted) Opening a specific and secret communication channel for NFT holders / Members only discord initiated.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist4">
                                                    <p>(77% Minted) 77 randomly-selected participants in the Public Sale will receive a surprise physical Merchandise.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist5">
                                                    <p>(99% Minted) Voting will begin for the next project to be selected from among The Simulacra Masters.</p>
                                                </li>
                                                <li className="roadmaplistitemsublistsublistitem" id="roadmaplist6">
                                                    <p>(100% Minted) 1 ETH raffle to the holder. And so, decentralized colonization Waiting the next project.</p>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="roadmaplistitemsublistitem">Accepting new project proposals from Creators and NFT owners</li>
                                        <li className="roadmaplistitemsublistitem">Support to the new projects</li>
                                    </ul>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="200" className="roadmaplistitem" id="roadmaplist3">
                                    <span>Q3 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem">Token launch & Airdrop to NFT holders</li>
                                        <li className="roadmaplistitemsublistitem">IDO &  Public Sale</li>
                                        <li className="roadmaplistitemsublistitem">Token Trading & Farming</li>
                                    </ul>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="250" className="roadmaplistitem" id="roadmaplist4">
                                    <span>Q4 2022</span>
                                    <ul className="roadmaplistitemsublist">
                                        <li className="roadmaplistitemsublistitem">NFT launchpad: Launch platform for other creators</li>
                                        <li className="roadmaplistitemsublistitem">NFT Marketplace Launch</li>
                                        <li className="roadmaplistitemsublistitem">Continuous Support Mechanism to Creators</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="faq-section" id="faq">
                        <img className="blobs blob5" src="/media/blobs/blob5.webp"/>
                        <div className="faqinfo">
                            <h2 data-aos="fade-up">Frequently Asked Questions</h2>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="100" className="faqaccordiondiv">
                            {faqs.map((faq, i) => (
                                <FAQ key={i} faq={faq} index={i} toggleFAQ={toggleFAQ} />
                            ))}
                        </div>
                    </section>

                    <section className="team-section" id="team">
                        <img className="blobs blob6" src="/media/blobs/blob6.webp"/>
                        <img className="blobs blob11" src="/media/blobs/blob6.webp"/>
                        <img className="blobs blob12" src="/media/blobs/blob5.webp"/>
                        <div className="teaminfo">
                            <h2 data-aos="fade-up">Who We Are?</h2>
                            <p data-aos="fade-up" data-aos-delay="100" id="whoWeAreP">
                                We are a community of creators and builders collaboratively shaping the story of Web 3.0. <br/><br/>
                                Our society consists of created humans who are virtually hardwired into becoming part of the Web 3.0 World and virtually integrated into the new way of life. 
                                However, Simulacra Society is open to everyone, regardless of experience or background. <br/><br/>
                                Join our fearless journey as we explore Web3.0, DAOs, NFT, decentralized colonization and governance. We will colonize and create our own world. Or just come for the memes & community.                     
                            </p>
                            <h3 data-aos="fade-up" data-aos-delay="150"><i className="fa-solid fa-angle-right"></i> What Will We Do?</h3>
                            <p data-aos="fade-up" data-aos-delay="200" id="whatWillWeDoP">We are creative people looking for a way out of this simulation. Our preliminary goal is to create great stories together and change the world. All we ask is for you to be yourself, your creativity and ambition.  </p>
                            <h3 data-aos="fade-up" data-aos-delay="150"><i className="fa-solid fa-angle-right"></i> Team</h3>
                            <p data-aos="fade-up" data-aos-delay="200" id="TeamP"><span className="highlighted">
                                We do not believe in names! We do not exist, so do our names.</span><br/><br/>
                                Besides that fact above, we are all seniors from the world with major corporate life experience. But we do not want our names to precede the project so we decided to reveal our names after minting. We understand it seems weird but we believe we do not have names in society. 
                            </p>
                        </div>
                        <div className="teammembers">
                            <ul>
                                <li data-aos="fade-up" data-aos-delay="250" id="teammembers1">
                                    <img src="/media/incubationPod/incubationPodEmpty.webp"/>
                                    <br/>
                                    <h3>Beaxvision</h3>
                                    <a className="teammemberslinks" href="https://twitter.com/beaxvision" target="_blank"><i className="fab fa-twitter"></i></a>
                                    <br/>
                                    <span className="highlighted">Knowledge is your past, vision is your future!</span>
                                    <p>Tech and Art Lover; 13+ years experience in the video game industry.</p>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="300" id="teammembers2">
                                    <img src="/media/incubationPod/incubationPodEmpty.webp"/>
                                    <br/>
                                    <h3>The Dreamer</h3>
                                    <a className="teammemberslinks" href="https://twitter.com/TheDreamerNFT" target="_blank"><i className="fab fa-twitter"></i></a>
                                    <br/>
                                    <span className="highlighted">Work hard, play hard & dream big!</span>
                                    <p>Finance & Business Master;  20+ years experience in Corporate (Ex-Deloitte, Vodafone, Gucci,  Armani, Entertainment Brand and Gaming) & Start Up (Ex-CFO of a start-up)</p>
                                </li>
                                <li data-aos="fade-up" data-aos-delay="350" id="teammembers3">
                                    <img src="/media/incubationPod/incubationPodEmpty.webp"/>
                                    <br/>
                                    <h3>The Oracle</h3>
                                    <a className="teammemberslinks" href="https://twitter.com/TheOracle_NFT" target="_blank"><i className="fab fa-twitter"></i></a>
                                    <br/>
                                    <span className="highlighted">If you want to live in a better world, create it yourself.</span>
                                    <p>Creative Director & Marketing Master; 20+ years experience in advertising agency & marketing strategy. She believes in technology.</p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="subscribe-section">
                        <div className="subscribeinfo">
                            <h2 data-aos="fade-up">Subscribe to our newsletter!</h2>
                            <div data-aos="fade-up" data-aos-delay="150" className="subscribediv">
                                <form onSubmit={(e) => submitSubscribeEmail(e)}>
                                    <input autoComplete="off" onChange={(e) => setSubscribeEmail(e.target.value)} autoCapitalize="off" name="email" type="email" placeholder="EMAIL ADDRESS"></input>
                                    <button type="submit" name="subscribe" className="medium-button">Subscribe</button> 
                                </form>
                            </div>
                        </div>
                    </section>

                    <section className="closing-section">
                        <div className="closinginfo">
                            <h2 data-aos="fade-up">Collaboration</h2>
                            <img data-aos="fade-up" data-aos-delay="100" src="/media/collaboration/collaboration.webp"/>
                            <p data-aos="fade-up" data-aos-delay="150">
                                If you're interested in collaborating with Simulacra Society, please submit your proposal details by filling out the form below. Our team will review your request and get back to you using the contact information that you've provided.
                            </p>
                            <div data-aos="fade-up" data-aos-delay="200"><a className="medium-button" href="https://forms.gle/AtSVXvae5hAT8zpQA" target="_blank">Fill the Form</a></div>
                        </div>
                    </section>

                    <section className="contracts-section">
                        <div className="contractsinfo">
                            <h2 data-aos="fade-up" data-aos-delay="100">Verified Smart Contract</h2>
                            <a data-aos="fade-up" data-aos-delay="150" target="_blank" href="https://etherscan.io/address/0xbfbec6992bed60704d90fff553e43b46ce33d868">0xBFBeC6992beD60704d90Fff553e43B46cE33d868</a>
                        </div>
                    </section>

                    <section className="footer-section">
                        <div className="footersectioncontent">
                            <div className="footersectioninfo">
                                <a data-aos="fade-in" data-aos-delay="200" href="/termsandconditions">Terms & Conditions</a>
                                <span data-aos="fade-in" data-aos-delay="250">© 2022 Simulacra Society</span>
                            </div>
                            <div data-aos="fade-in" data-aos-delay="200" className="footersectionsocialmenubar">
                                <a className="footersectionsocialmenubuttons" href="https://opensea.io/SimulacraSociety" target="_blank"><div className="openSeaIcon"></div></a>
                                <a className="footersectionsocialmenubuttons" href="https://twitter.com/simulacranft" target="_blank"><div className="twitterIcon"></div></a>
                                <a className="footersectionsocialmenubuttons" href="https://www.instagram.com/simulacrasociety/" target="_blank"><div className="instagramIcon"></div></a>
                                <a className="footersectionsocialmenubuttons" href="https://www.linkedin.com/company/simulacrasociety/" target="_blank"><div className="linkedinIcon"></div></a>
                            </div>
                        </div>
                    </section>

                </div>
            </motion.div>
        </React.Fragment>
    )
}

export default Home;