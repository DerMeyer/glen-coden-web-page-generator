import { useState, useCallback } from 'react';


export default function useDebounce(time) {
    const [ guard, setGuard ] = useState(false);

    const debounce = useCallback(
        () => {
            setGuard(true);
            window.setTimeout(() => {
                setGuard(false);
            }, time)
        },
        [ time ]
    );

    return [ guard, debounce ];
}