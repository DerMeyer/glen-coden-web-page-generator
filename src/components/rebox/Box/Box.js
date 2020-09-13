import React, { useEffect } from 'react';
import s from './Box.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';


export default function Box({ children, ...input }) {
    const { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css } = input;

    const [ boxStyle, setBoxStyle ] = useBoxStyle(input);

    useEffect(() => {
        setBoxStyle({ p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css });
    }, [ p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css, setBoxStyle ]);

    return (
        <div
            className={s.box}
            style={boxStyle}
        >
            {children}
        </div>
    );
}