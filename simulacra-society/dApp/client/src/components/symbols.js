import React from 'react';
import { motion } from 'framer-motion/dist/framer-motion';

const variants = {
  opacity: { opacity: 0, transition: { duration: 0.250 } },
  stop: { opacity: 1, transition: { duration: 0.250 } }
};

function Symbols ({ symbolChanged, symbolImage, symbolName, symbolRarity, symbolDesc}) {
    return (
        <>
            <motion.img variants={variants} animate={symbolChanged ? 'opacity' : 'stop'} src={symbolImage}/>
            <div className='symbolDiv'>
                <h4>Symbol Name</h4>
                <motion.span variants={variants} animate={symbolChanged ? 'opacity' : 'stop'}>{symbolName}</motion.span>
            </div>
            <div className='symbolDiv'>
                <h4>Symbol Rarity</h4>
                <motion.span variants={variants} animate={symbolChanged ? 'opacity' : 'stop'}>{symbolRarity}</motion.span>
            </div>
            <div className='symbolsDescription'>
                <h4>Symbol Description</h4>
                <motion.p variants={variants} animate={symbolChanged ? 'opacity' : 'stop'}>{symbolDesc}</motion.p>
            </div>
        </>
    );
};

<motion.img
        
        id="monkeyFace"
        src="/images/Monkey.png"
      />

Symbols.defaultProps = {
    symbolImage: "media/symbols/Aqirheed.svg",
    symbolName: "Aqirheed",
    symbolRarity: "Common",
    symbolDesc: "You know there's always a second way. that's why you're here. glad you are with us.",
}

export default Symbols;