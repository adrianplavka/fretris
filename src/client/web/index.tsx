
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './containers';
import { log } from './utils/logger';
import { isDevMode } from './utils/dev';
import { initStore } from './reducers/store';
import Connection from './network';
import './styles.css';

log("Index", "Started in development mode.");

export const store = initStore();
const app = (
    <Provider store={store}>
        <App />
    </Provider>
);
const rootElem = document.getElementById('root');

ReactDOM.render(app, rootElem);
export const connection = new Connection();
