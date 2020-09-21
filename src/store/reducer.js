import { trackingService } from '../index';
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
        case ActionTypes.ALL_COMPS_INITIATED:
            if (!state.loading.length) {
                trackingService.pageLoaded();
            }
            return {
                ...state,
                allCompsInitiated: true
            };
        case ActionTypes.START_LOADING:
            return {
                ...state,
                loading: [ ...state.loading, action.id ]
            };
        case ActionTypes.STOP_LOADING:
            const loading = [ ...state.loading ];
            loading.splice(state.loading.indexOf(action.id), 1);
            if (!loading.length) {
                trackingService.pageLoaded();
            }
            return {
                ...state,
                loading
            };
        case ActionTypes.LOADING_TIMEOUT:
            return {
                ...state,
                loading: []
            };
        default:
            return state;
    }
};

export default reducer;