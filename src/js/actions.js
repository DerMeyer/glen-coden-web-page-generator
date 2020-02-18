import { getBreakPointType, getDeviceType, getOrientationType } from './helpers';

export const ActionTypes = {
    SHOW_APP: 'show-app',
    RESIZE: 'resize',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    LOADING_TIMEOUT: 'loading-timeout'
};

const actions = {
    showApp: () => ({
        type: ActionTypes.SHOW_APP
    }),
    resize: (width, height) => ({
        type: ActionTypes.RESIZE,
        sizeTo: { width, height },
        breakPointType: getBreakPointType(width),
        deviceType: getDeviceType(),
        orientationType: getOrientationType()
    }),
    startLoading: () => ({
        type: ActionTypes.START_LOADING
    }),
    stopLoading: () => ({
        type: ActionTypes.STOP_LOADING
    }),
    loadingTimeout: () => ({
        type: ActionTypes.LOADING_TIMEOUT
    })
};

export default actions;