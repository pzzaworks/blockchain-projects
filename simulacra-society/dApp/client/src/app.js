import React, { useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import AOS from "aos";
import "aos/dist/aos.css";

import Intro from './pages/intro.js';
import Home from './pages/home.js';
import TermsAndConditions from './pages/termsandconditions.js';

function App() {
  const location = useLocation();

  useEffect(() => {
      AOS.init({
        duration: 650,
        once: true,
      });
      AOS.refresh();
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Intro />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/termsandconditions' element={<TermsAndConditions />}></Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App;
