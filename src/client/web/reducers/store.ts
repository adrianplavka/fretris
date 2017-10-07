
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

import { isDevMode } from '../utils/dev';

export interface RootState {

};

export const initialState: RootState = {

};

// Initialize the Redux store 
// (w/ Redux Dev Tools & logger, if in development mode).
export const initStore = (): Redux.Store<RootState> => {
    return Redux.createStore(
        // TODO: Change for a combined reducer.
        (state, action): RootState => { return { ...state }; },
        initialState,
        isDevMode
            ? composeWithDevTools(Redux.applyMiddleware(createLogger()))
            : undefined
    );
};
