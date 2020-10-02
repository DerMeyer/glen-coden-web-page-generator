import React, { useEffect } from 'react';
import s from './Box.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';


export default function Box(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);

    useEffect(() => {
        getBoxStyle(props);
    });

    return (
        <div
            className={s.box}
            style={boxStyle}
        >
            {props.children}
        </div>
    );
}