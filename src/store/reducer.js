import { ActionTypes } from './actions';

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.RESIZE:
            return {
                ...state,
                vw: action.sizeTo.width,
                vh: action.sizeTo.height,
                breakPointType: action.breakPointType,
                deviceType: action.deviceType,
                orientationType: action.orientationType
            };
        case ActionTypes.ON_INITIAL_VIEW_COMPLETE:
            return {
                ...state,
                initialViewComplete: true
            };
        default:
            return state;
    }
};

export default reducer;