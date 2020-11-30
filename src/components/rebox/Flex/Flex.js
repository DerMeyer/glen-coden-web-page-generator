import React, { useEffect } from 'react';
import s from './Flex.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useFlexStyle from '../../../hooks/useFlexStyle';


export default function Flex(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ flexStyle, getFlexStyle ] = useFlexStyle(props);

    useEffect(() => {
        getBoxStyle(props);
        getFlexStyle(props);
    });

    return (
        <div
            className={s.flex}
            style={{
                ...boxStyle,
                ...flexStyle
            }}
        >
            {props.children}
        </div>
    );
}