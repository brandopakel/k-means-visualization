import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');

//const rootElement = ReactDOM.createRoot(document.getElementById('root'));
if(container){
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
} else{
    console.error("Root element not found");
}