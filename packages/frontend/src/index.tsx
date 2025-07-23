import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
<<<<<<< HEAD
import reportWebVitals from './reportWebVitals';
import App from './App';
=======
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
>>>>>>> origin/main

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <App />
=======
    <Provider store={store}>
      <App />
    </Provider>
>>>>>>> origin/main
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
