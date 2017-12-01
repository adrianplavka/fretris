
import * as Redux from 'redux';

import * as Action from '../actions/playground';

export interface PlaygroundState {
    score: number;
}

export const PlaygroundInitialState: PlaygroundState = {
    score: 0
};

export function PlaygroundReducer(state = PlaygroundInitialState, action: Redux.AnyAction) {
    switch (action.type) {
        case Action.PLAYGROUND_SCORE:
            return { ...state, score: action.payload }
        default:
            return state;
    }
}


