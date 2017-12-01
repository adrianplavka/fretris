
export const PLAYGROUND_SCORE = 'PLAYGROUND_SCORE';

export const setScore = (score: number) => {
    return {
        type: PLAYGROUND_SCORE,
        payload: score
    };
}
