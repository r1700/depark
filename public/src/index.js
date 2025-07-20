import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // אם יש קובץ CSS
import App from './App'; // אם יש לך קובץ App.js

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);