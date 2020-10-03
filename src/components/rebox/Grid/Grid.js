import React, { useEffect } from 'react';
import s from './Grid.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useGridStyle from '../../../hooks/useGridStyle';


export default function Grid(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ gridStyle, getGridStyle ] = useGridStyle(props);

    useEffect(() => {
        getBoxStyle(props);
        getGridStyle(props);
    });

    return (
        <div
            className={s.grid}
            style={{
                ...boxStyle,
                ...gridStyle
            }}
        >
            {props.children}
        </div>
    );
}