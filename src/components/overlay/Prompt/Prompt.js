import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Prompt.module.css';
import cx from 'classnames';
import useViewportSize from '../../../hooks/useViewportSize';
import CloseIcon from '../../icons/CloseIcon/CloseIcon';


export default function Prompt({ from, height, offset, showAfter, showFor, animationDuration, stopContentPropagation, bg, color, contentSize, maxContentWidth, css, children }) {
    const { vw } = useViewportSize();

    const promptRef = useRef(null);

    const [ style, setStyle ] = useState({});
    const [ show, setShow ] = useState(showAfter <= 0);
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
                if (showFor) {
                    setTimeoutId(window.setTimeout(() => setClosing(true), showFor * 1000));
                }
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
                className={cx(s.Prompt, {
                    [s.fromTop]: from === 'top',
                    [s.fromBottom]: from === 'bottom',
                    [s.showFromTop]: from === 'top' && (show && !closing),
                    [s.showFromBottom]: from === 'bottom' && (show && !closing),
                    [s.hideToTop]: from === 'top' && closing,
                    [s.hideToBottom]: from === 'bottom' && closing,
                })}
                style={{
                    ...style,
                    [from]: `${offset}px`,
                    animationDuration: `${animationDuration}s`
                }}
                onTransitionEnd={onTransitionEnd}
                onClick={() => setClosing(true)}
            >
                <div
                    className={s.Children}
                    style={{
                        maxWidth: `${maxContentWidth}px`,
                        width: `${contentSize.width * 100}%`
                    }}
                    onClick={e => {
                        if (stopContentPropagation) {
                            e.stopPropagation();
                        }
                    }}
                >
                    {children}
                </div>
                <div className={s.CloseIcon}>
                    <CloseIcon color={color} />
                </div>
            </div>
            <div
                className={s.Spacer}
                style={{
                    height: (show && !closing) ? `${promptRef.current ? promptRef.current.offsetHeight : 0}px` : 0,
                    transitionDuration: `${animationDuration}s`
                }}
            />
        </>
    );
}