import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
//import Fetching from './fetching';
import reportWebVitals from './reportWebVitals';
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('reactJSApp'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

reportWebVitals();
