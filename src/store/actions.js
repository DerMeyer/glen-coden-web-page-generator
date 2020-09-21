import { getBreakPointType, getDeviceType, getOrientationType } from '../js/helpers';

export const ActionTypes = {
    RESIZE: 'resize',
    ALL_COMPS_INITIATED: 'all-comps-initiated',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    LOADING_TIMEOUT: 'loading-timeout'
};

const actions = {
    resize: (width, height) => ({
        type: ActionTypes.RESIZE,
        sizeTo: { width, height },
        breakPointType: getBreakPointType(width),
        deviceType: getDeviceType(),
        orientationType: getOrientationType()
    }),
    allCompsInitiated: () => ({
        type: ActionTypes.ALL_COMPS_INITIATED
    }),
    startLoading: id => ({
        type: ActionTypes.START_LOADING,
        id
    }),
    stopLoading: id => ({
        type: ActionTypes.STOP_LOADING,
        id
    }),
    loadingTimeout: () => ({
        type: ActionTypes.LOADING_TIMEOUT
    })
};

export default actions;