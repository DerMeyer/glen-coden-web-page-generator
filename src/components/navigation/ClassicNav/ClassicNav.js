import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './ClassicNav.module.css';
import { useSelector } from 'react-redux';

import BurgerIcon from '../../icons/BurgerIcon/BurgerIcon';
import Overlay from '../../overlay/Overlay/Overlay';


export default function ClassicNav({ burger, widthFactor, height, split, burgerColor, overlayColor, bg, contentSize, maxContentWidth, css, children }) {
    const vw = useSelector(state => state.app.vw);

    const navRef = useRef(null);

    const [ style, setStyle ] = useState({});
    const [ contentStyle, setContentStyle ] = useState({});

    const [ showOverlay, setShowOverlay ] = useState(false);

    const onOverlayClosed = useCallback(
        () => setShowOverlay(false),
        []
    );

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
        r.width = vw > maxContentWidth / contentSize.width
            ? `${maxContentWidth * contentSize.width * widthFactor}px`
            : `${contentSize.width * 100}%`;
        setContentStyle(r);
    }, [ widthFactor, contentSize, maxContentWidth, vw ]);

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
                                color={showOverlay ? bg : burgerColor}
                            />
                        </div>
                    ) : (
                        <div className={s.Items}>
                            {Array.isArray(children) && children.slice(split)}
                        </div>
                    )}
                </div>
                {showOverlay && (
                    <Overlay
                        color={overlayColor}
                        onFadeOut={onOverlayClosed}
                    >
                        <div className={s.OverlayContent}>
                            {Array.isArray(children) && children.slice(split)}
                        </div>
                    </Overlay>
                )}
            </nav>
            <div style={{ height: `${height}px` }} />
        </>
    );
}