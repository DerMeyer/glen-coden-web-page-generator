import { createSlice } from '@reduxjs/toolkit';
import { getBreakPointType, getDeviceType, getOrientationType } from '../js/helpers';


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        initialViewComplete: false,
        vw: window.innerWidth,
        vh: window.innerHeight,
        breakPointType: getBreakPointType(),
        deviceType: getDeviceType(),
        orientationType: getOrientationType(),
        language: navigator.language.slice(0, 2)
    },
    reducers: {
        onInitialViewComplete: state => {
            state.initialViewComplete = true;
        },
        resize: (state, action) => {
            const { width, height } = action.payload;
            state.vw = width;
            state.vh = height;
            state.breakPointType = getBreakPointType(width);
            state.deviceType = getDeviceType();
            state.orientationType = getOrientationType();
        }
    }
});

export const { onInitialViewComplete, resize } = appSlice.actions;

export const selectSize = state => ({
    vw: state.app.vw,
    vh: state.app.vh
});

export default appSlice.reducer;
