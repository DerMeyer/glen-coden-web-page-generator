import { ActionTypes } from './actions';


const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_APP:
            return {
                ...state,
                showApp: true
            };
        case ActionTypes.RESIZE:
            return {
                ...state,
                viewportWidth: action.sizeTo.width,
                viewportHeight: action.sizeTo.height,
                breakPointType: action.breakPointType,
                deviceType: action.deviceType,
                orientationType: action.orientationType
            };
        case ActionTypes.START_LOADING:
            return {
                ...state,
                loading: state.loading + 1
            };
        case ActionTypes.STOP_LOADING:
            return {
                ...state,
                loading: Math.max(state.loading - 1, 0)
            };
        case ActionTypes.LOADING_TIMEOUT:
            return {
                ...state,
                loading: 0
            };
        case ActionTypes.SET_CONTENT_WIDTH:
            return {
                ...state,
                contentWidth: action.contentSize.width,
                contentHeight: action.contentSize.height
            };
        default:
            return state;
    }
};

export default reducer;