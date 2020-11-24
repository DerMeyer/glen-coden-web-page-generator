import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import s from './FlyOverBox.module.css';
import Store from '../../../store/Store';
import ZoomBox from '../ZoomBox/ZoomBox';


export default function FlyOverBox({ height, maxHeight = Infinity, children }) {
    const { state } = useContext(Store);

    const boxRef = useRef(null);
    const contentRef = useRef(null);

    const [ boxHeight, setBoxHeight ] = useState(0);
    const [ contentTop, setContentTop ] = useState(0);

    const calcContentTop = useCallback(
        () => {
            const y = boxRef.current.offsetTop - window.scrollY;
            const boxHeight = boxRef.current.offsetHeight;
            const contentHeight = contentRef.current.offsetHeight;

            if (y > state.vh) {
                setContentTop(boxHeight - contentHeight);
                return;
            }
            if (y < -boxHeight) {
                setContentTop(0);
                return;
            }
            setContentTop((boxHeight - contentHeight) * (y / (state.vh + boxHeight)));
        },
        [ state.vh ]
    );

    useEffect(() => {
        if (typeof height === 'number') {
            setBoxHeight(Math.min(height, maxHeight));
            return;
        }
        setBoxHeight(Math.min(contentRef.current.getBoundingClientRect().height * Number(height.slice(0, -1)) / 100, maxHeight));
    }, [ height, maxHeight, state.loading, state.vh, state.vw ]);

    useEffect(() => {
        if (!height) {
            return;
        }
        window.addEventListener('scroll', calcContentTop);
        return () => {
            window.removeEventListener('scroll', calcContentTop);
        };
    }, [ height, calcContentTop ]);

    if (!height) {
        return null;
    }

    return (
        <div
            ref={boxRef}
            className={s.FlyOverBox}
            style={{
                height: `${boxHeight}px`
            }}
        >
            <div
                ref={contentRef}
                className={s.Content}
                style={{
                    top: `${contentTop}px`
                }}
            >
                <ZoomBox>
                    {children}
                </ZoomBox>
            </div>
        </div>
    );
}