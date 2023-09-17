import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

import App from './app';
import Login from './login';

export default function Navigation() {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Login />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/app' element={<App/>}></Route>
        </Routes>
    )
}