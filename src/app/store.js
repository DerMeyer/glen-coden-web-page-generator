import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';


export default configureStore({
    preloadedState: {
        // preload from server
    },
    reducer: {
        app: appReducer
    },
});
