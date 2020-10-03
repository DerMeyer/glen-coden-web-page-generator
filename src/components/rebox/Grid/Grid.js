import React, { useEffect } from 'react';
import s from './Grid.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useFlexStyle from '../../../hooks/useFlexStyle';


export default function Grid(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ flexStyle, getFlexStyle ] = useFlexStyle(props);

    useEffect(() => {
        getBoxStyle(props);
        getFlexStyle(props);
    });

    return (
        <div
            className={s.grid}
            style={{
                ...boxStyle,
                ...flexStyle
            }}
        >
            {props.children}
        </div>
    );
}