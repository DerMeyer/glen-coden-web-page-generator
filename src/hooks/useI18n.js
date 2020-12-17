import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { i18n } from '../js/helpers';


export default function useI18n(props) {
    const language = useSelector(state => state.app.language);

    const [ input, setInput ] = useState(props);
    const [ translation, setTranslation ] = useState('');

    useEffect(() => {
        setTranslation(i18n(input, language));
    }, [ input, language ]);

    return [ translation, setInput ];
}