import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import Navigation from './pages/navigation';

ReactDOM.render(
    <BrowserRouter>
        <Navigation />
    </BrowserRouter>,
    document.getElementById('reactJSApp')
);

reportWebVitals();