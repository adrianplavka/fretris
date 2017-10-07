
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Workspace } from './containers';
import { log } from './utils/logger';
import { isDevMode } from './utils/dev';
import { initStore } from './reducers/store';
import './styles.css';

log("Index", "Started in development mode.");

export const store = initStore();
const app = (
    <Provider store={store}>
        <Workspace />
    </Provider>
);
const rootElem = document.getElementById('workspace');

ReactDOM.render(app, rootElem);
