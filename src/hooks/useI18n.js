import { useContext, useState, useEffect } from 'react';
import Store from '../store/store';
import { i18n } from '../js/helpers';


export default function useI18n(props) {
    const { state } = useContext(Store);

    const [ input, setInput ] = useState(props);
    const [ translation, setTranslation ] = useState('');

    useEffect(() => {
        setTranslation(i18n(input, state.language));
    }, [ input, state.language ]);

    return [ translation, setInput ];
}