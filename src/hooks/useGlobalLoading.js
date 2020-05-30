import { useContext, useState, useCallback } from 'react';
import Store from '../store/Store';
import actions from '../store/actions';
import shortid from 'shortid';


export default function useGlobalLoading() {
    const { dispatch, state } = useContext(Store);

    const [ id ] = useState(() => shortid.generate());
    const [ hasLoaded, setHasLoaded ] = useState(false);

    const startLoading = useCallback(
        () => {
            dispatch(actions.startLoading(id));
            setHasLoaded(false);
        },
        [ dispatch, id ]
    );

    const stopLoading = useCallback(
        () => {
            dispatch(actions.stopLoading(id));
            if (!state.loading.length) {
                setHasLoaded(true);
            }
        },
        [ dispatch, state, id ]
    );

    return [ startLoading, stopLoading, hasLoaded ];
}