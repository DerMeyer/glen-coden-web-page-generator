import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Prompt.module.css';
import useViewportSize from '../../../hooks/useViewportSize';
import CloseIcon from '../../icons/CloseIcon/CloseIcon';


export default function Prompt({ from, height, offset, showAfter, showFor, animationDuration, bg, color, css, children }) {
    const { vw } = useViewportSize();

    const promptRef = useRef(null);

    const [ style, setStyle ] = useState({});
    const [ show, setShow ] = useState(false);
    const [ closing, setClosing ] = useState(false);
    const [ timeoutId, setTimeoutId ] = useState(0);

    const onTransitionEnd = useCallback(
        () => {
            if (!closing) {
                return;
            }
            window.clearTimeout(timeoutId);
            setShow(false);
            setClosing(false);
        },
        [ closing, timeoutId ]
    );

    useEffect(() => {
        if (showAfter) {
            const timeoutId = window.setTimeout(() => {
                setTimeoutId(window.setTimeout(() => setClosing(true), showFor * 1000));
                setShow(true);
            }, showAfter * 1000);
            return () => window.clearTimeout(timeoutId);
        }
    }, [ showAfter, showFor ]);

    useEffect(() => {
        setStyle(prevState => {
            const r = { ...prevState };
            if (height) {
                r.height = `${height}px`;
            }
            if (bg) {
                r.backgroundColor = bg;
            }
            if (color) {
                r.color = color;
            }
            if (vw) {
                r.width = `${vw}px`;
            }
            if (css) {
                return { ...r, ...css };
            }
            return r;
        });
    }, [ height, bg, color, css, vw ]);

    return (
        <>
            <div
                ref={promptRef}
                className={s.Prompt}
                style={{
                    ...style,
                    [from]: (show && !closing) ? offset : offset - (promptRef.current ? promptRef.current.getBoundingClientRect().height : 0),
                    transition: `${from} ${show || closing ? animationDuration : 0}s ease-out`
                }}
                onTransitionEnd={onTransitionEnd}
                onClick={() => setClosing(true)}
            >
                <div
                    className={s.Children}
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </div>
                <div className={s.CloseIcon}>
                    <CloseIcon color={color} />
                </div>
            </div>
            <div style={{
                height: (show && !closing) ? `${height}px` : 0,
                transition: `height ${animationDuration}s ease-out`
            }} />
        </>
    );
}