import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './ZoomBox.module.css';

ZoomBox.defaultProps = {
    auto: false,
    factor: 4,
    time: 0.5
};


export default function ZoomBox({ auto, factor, time, children }) {
    const boxRef = useRef(null);

    const [ active, setActive ] = useState(false);
    const [ shift, setShift ] = useState({ x: 0, y: 0 });

    const grow = useCallback(() => setActive(true), []);
    const shrink = useCallback(() => setActive(false), []);

    const calcShift = useCallback(
        event => {
            const rect = boxRef.current.getBoundingClientRect();
            const xFromCenter = event.offsetX - (rect.width / 2);
            const yFromCenter = event.offsetY - (rect.height / 2);
            setShift({
                x: -xFromCenter / (rect.width / 2) * factor / 2,
                y: -yFromCenter / (rect.height / 2) * factor / 2
            });
        },
        [ factor ]
    );

    useEffect(() => {
        if (auto) {
            grow();
            return;
        }
        const onMousemove = event => {
            grow();
            calcShift(event);
        };
        const box = boxRef.current;
        box.addEventListener('mousemove', onMousemove);
        box.addEventListener('blur', shrink);
        box.addEventListener('mouseleave', shrink);
        return () => {
            box.removeEventListener('mousemove', onMousemove);
            box.removeEventListener('blur', shrink);
            box.removeEventListener('mouseleave', shrink);
        };
    }, [ auto, grow, shrink, calcShift ]);

    return (
        <div
            ref={boxRef}
            className={s.box}
        >
            <div
                className={s.shifter}
                style={{
                    transform: `translate(${active ? shift.x : 0}%, ${active ? shift.y : 0}%)`,
                    transition: active ? '' :`width ${time}s ease-out, height ${time}s ease-out, transform ${time}s ease-out`
                }}
            >
                <div
                    className={s.zoomer}
                    style={{
                        transform: `scale(${active ? (1 + factor / 100) : 1})`,
                        transition: `transform ${time}s ease-out`
                    }}
                    onTransitionEnd={() => console.log('transition end')}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}