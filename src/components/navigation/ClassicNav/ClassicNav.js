import React, { useContext, useRef, useState, useEffect } from 'react';
import s from './ClassicNav.module.css';
import Store from '../../../store/Store';
import BurgerIcon from '../../icons/BurgerIcon/BurgerIcon';


export default function ClassicNav({ burger, widthFactor, height, split, color, bg, contentSize, maxContentWidth, css, children }) {
    const { state } = useContext(Store);

    const navRef = useRef(null);

    const [ style, setStyle ] = useState({});
    const [ contentStyle, setContentStyle ] = useState({});

    const [ showOverlay, setShowOverlay ] = useState(false);

    useEffect(() => {
        const r = {};
        r.height = `${height}px`;
        r.color = color;
        r.backgroundColor = bg;
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ height, color, bg, css ]);

    useEffect(() => {
        const r = {};
        r.width = state.vw > maxContentWidth / contentSize.width
            ? `${maxContentWidth * contentSize.width * widthFactor}px`
            : `${contentSize.width * 100}%`;
        setContentStyle(r);
    }, [ widthFactor, contentSize, maxContentWidth, state.vw ]);

    return (
        <>
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
                            onClick={() => setShowOverlay(prevState => !prevState)}
                        >
                            <BurgerIcon
                                close={showOverlay}
                                color={showOverlay ? bg : color}
                            />
                        </div>
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
            <div style={{ height: `${height}px` }} />
        </>
    );
}