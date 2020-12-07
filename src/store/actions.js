import { getBreakPointType, getDeviceType, getOrientationType } from '../js/helpers';

export const ActionTypes = {
    RESIZE: 'resize',
    ON_INITIAL_VIEW_COMPLETE: 'on-initial-view-complete'
};

const actions = {
    resize: (width, height) => ({
        type: ActionTypes.RESIZE,
        sizeTo: { width, height },
        breakPointType: getBreakPointType(width),
        deviceType: getDeviceType(),
        orientationType: getOrientationType()
    }),
    onInitialViewComplete: () => ({
        type: ActionTypes.ON_INITIAL_VIEW_COMPLETE
    })
};

export default actions;