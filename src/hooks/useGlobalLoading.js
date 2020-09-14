import { useContext, useState, useCallback } from 'react';
import Store from '../store/Store';
import actions from '../store/actions';
import shortid from 'shortid';


export default function useGlobalLoading() {
    const { dispatch, state } = useContext(Store);

    const [ id ] = useState(() => shortid.generate());

    const startLoading = useCallback(() => dispatch(actions.startLoading(id)), [ dispatch, id ]);
    const stopLoading = useCallback(() => dispatch(actions.stopLoading(id)), [ dispatch, id ]);

    const done = state.loading.length === 0 && state.allCompsInitiated;

    return [ startLoading, stopLoading, done ];
}