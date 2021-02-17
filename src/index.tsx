
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, {rootSaga} from "./State"
import createSagaMiddleware from 'redux-saga';

import { composeWithDevTools } from 'redux-devtools-extension'; 

const sagaMiddleware = createSagaMiddleware(); 
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
sagaMiddleware.run(rootSaga)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename="/dfd">
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
