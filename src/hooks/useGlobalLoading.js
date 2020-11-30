import { useContext, useState, useCallback } from 'react';
import Store from '../store/Store';
import actions from '../store/actions';
import shortid from 'shortid';


export default function useGlobalLoading() {
    const { dispatch, state } = useContext(Store);

    const [ id ] = useState(() => shortid.generate());

    const startLoading = useCallback(
        () => {
            if (state.allCompsInitiated) {
                return;
            }
            dispatch(actions.startLoading(id));
        },
        [ state.allCompsInitiated, dispatch, id ]
    );

    const stopLoading = useCallback(
        () => {
            if (!state.loading.includes(id)) {
                return;
            }
            dispatch(actions.stopLoading(id));
        },
        [ state.loading, dispatch, id ]
    );

    const done = state.loading.length === 0 && state.allCompsInitiated;

    return [ startLoading, stopLoading, done ];
}