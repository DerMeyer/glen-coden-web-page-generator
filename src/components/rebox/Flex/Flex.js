import React, { useEffect } from 'react';
import s from './Flex.module.css';
import useFlexStyle from '../../../hooks/useFlexStyle';
import useBoxStyle from '../../../hooks/useBoxStyle';


export default function Flex({ children, ...input }) {
    const { flexDirection, flexWrap, justifyContent, alignItems, p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css } = input;

    const [ boxStyle, setBoxStyle ] = useBoxStyle(input);
    const [ flexStyle, setFlexStyle ] = useFlexStyle(input);

    useEffect(() => {
        setFlexStyle({ flexDirection, flexWrap, justifyContent, alignItems });
    }, [ flexDirection, flexWrap, justifyContent, alignItems, setFlexStyle ]);

    useEffect(() => {
        setBoxStyle({ p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css });
    }, [ p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css, setBoxStyle ]);

    return (
        <div
            className={s.flex}
            style={{
                ...boxStyle,
                ...flexStyle
            }}
        >
            {children}
        </div>
    );
}