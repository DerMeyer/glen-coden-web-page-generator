import React, { useRef, useState, useEffect } from 'react';
import s from './Prompt.module.css';


export default function Prompt({ from, offset, showAfter, showFor, animationDuration, doShow, children }) {
    const promptRef = useRef(null);

    const [ show, setShow ] = useState(false);
    //const [ timeoutId, setTimeoutId ] = useState(0);

    useEffect(() => {
        if (showAfter) {
            const timeoutId = window.setTimeout(() => setShow(true), showAfter * 1000);
            return () => window.clearTimeout(timeoutId);
        }
    }, [ showAfter ]);

    return (
        <div
            ref={promptRef}
            className={s.Prompt}
            style={{
                top: show ? offset : offset - (promptRef.current ? promptRef.current.getBoundingClientRect().height : 10000),
                transition: `top ${show ? animationDuration : 0}s ease-out`
            }}
        >
            {children}
        </div>
    );
}