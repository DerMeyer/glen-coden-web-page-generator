import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './ZoomBox.module.css';

ZoomBox.defaultProps = {
    auto: false,
    doZoom: false,
    factor: 4,
    time: 0.5
};


export default function ZoomBox({ auto, doZoom, factor, time, children }) {
    const boxRef = useRef(null);

    const [ active, setActive ] = useState(false);
    const [ shift, setShift ] = useState({ x: 0, y: 0 });

    const grow = useCallback(() => setActive(true), []);
    const shrink = useCallback(event => {
        console.log(event);// TODO remove dev code
        if (event && event.target) {
            const { x, y, width, height } = boxRef.current.getBoundingClientRect();
            if (
                (event.target.pageX > x && event.target.pageX < x + width)
                || (event.target.pageY > y && event.target.pageY < y + height)
            ) {
                return;
            }
        }
        setActive(false);
    }, []);

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
        const onMouseLeave = event => shrink(event);
        const box = boxRef.current;
        box.addEventListener('mousemove', onMousemove);
        box.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('blur', shrink);
        return () => {
            box.removeEventListener('mousemove', onMousemove);
            box.removeEventListener('mouseleave', shrink);
            window.removeEventListener('blur', shrink);
        };
    }, [ auto, grow, shrink, calcShift ]);

    return (
        <div
            ref={boxRef}
            className={s.ZoomBox}
        >
            <div
                className={s.Shifter}
                style={{
                    transform: `translate(${active ? shift.x : 0}%, ${active ? shift.y : 0}%)`,
                    transition: active ? '' :`width ${time}s ease-out, height ${time}s ease-out, transform ${time}s ease-out`
                }}
            >
                <div
                    className={s.Zoomer}
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