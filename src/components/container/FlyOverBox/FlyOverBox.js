import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import s from './FlyOverBox.module.css';
import Store from '../../../store/Store';


export default function FlyOverBox({ height, children }) {
    const { state } = useContext(Store);

    const boxRef = useRef(null);
    const contentRef = useRef(null);

    const [ boxHeight, setBoxHeight ] = useState(0);
    const [ contentTop, setContentTop ] = useState(0);

    const calcContentTop = useCallback(
        () => {
            const { height: boxHeight, y } = boxRef.current.getBoundingClientRect();
            const { height: contentHeight } = contentRef.current.getBoundingClientRect();

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
            setBoxHeight(height);
            return;
        }
        setBoxHeight(contentRef.current.getBoundingClientRect().height * Number(height.slice(0, -1)) / 100);
    }, [ height, state.loading, state.vh, state.vw ]);

    useEffect(() => {
        window.addEventListener('scroll', calcContentTop);
        return () => {
            window.removeEventListener('scroll', calcContentTop);
        };
    }, [ calcContentTop ]);

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
                {children}
            </div>
        </div>
    );
}