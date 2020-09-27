import React, { useRef, useState, useEffect } from 'react';
import s from './ClassicNav.module.css';


export default function ClassicNav({ burger, width, height, split, bg, contentSize, maxContentWidth, css, children }) {
    const navRef = useRef(null);

    const [ style, setStyle ] = useState({});
    const [ contentStyle, setContentStyle ] = useState({});

    const [ showOverlay, setShowOverlay ] = useState(false);

    useEffect(() => {
        const r = {};
        r.height = `${height}px`;
        r.backgroundColor = bg;
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ height, bg, css ]);

    useEffect(() => {
        const r = {};
        r.width = `${maxContentWidth * contentSize.width * width}px`;
        setContentStyle(r);
    }, [ width, contentSize, maxContentWidth ]);

    return (
        <nav
            ref={navRef}
            className={s.ClassicNav}
            style={style}
        >
            <div
                className={s.Content}
                style={contentStyle}
            >
                <div className={s.Items}>
                    {Array.isArray(children) ? children.slice(0, split) : children}
                </div>
                {burger ? (
                    <div
                        className={s.Burger}
                        onClick={() => setShowOverlay(true)}
                    />
                ) : (
                    <div className={s.Items}>
                        {Array.isArray(children) && children.slice(split)}
                    </div>
                )}
            </div>
            {showOverlay && (
                <div
                    className={s.Overlay}
                    onClick={() => setShowOverlay(false)}
                >
                    <div className={s.OverlayContent}>
                        {Array.isArray(children) && children.slice(split)}
                    </div>
                </div>
            )}
        </nav>
    );
}