import { useCallback, useState } from 'react';
import apiService from 'services/apiService';


const useApi = method => {
    const [ busy, setBusy ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ data, setData ] = useState(null);

    const makeRequest = useCallback(async payload => {
        setBusy(true);
        setData(null);
        setError(null);

        try {
            const response = await apiService[method](payload);
            setBusy(false);
            setData(response);
        } catch (error) {
            setError(error.message);
            setBusy(false);
        }

    }, [ method ]);

    return [ makeRequest, busy, data, error ];
};

export default useApi;