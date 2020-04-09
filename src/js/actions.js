import { getBreakPointType, getContentSize, getDeviceType, getOrientationType } from './helpers';

export const ActionTypes = {
    SHOW_APP: 'show-app',
    RESIZE: 'resize',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    LOADING_TIMEOUT: 'loading-timeout',
    SET_CONTENT_WIDTH: 'set-content-width'
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
    }),
    setContentSize: (deviceType, pageContentSize) => ({
        type: ActionTypes.SET_CONTENT_WIDTH,
        contentSize: getContentSize(deviceType, pageContentSize)
    })
};

export default actions;