import React, { useEffect } from 'react';
import s from './Flex.module.css';
import useFlexStyle from '../../../hooks/useFlexStyle';


export default function Flex({ children, ...input }) {
    const { flexDirection, flexWrap, justifyContent, alignItems } = input;

    const [ flexStyle, setFlexStyle ] = useFlexStyle(input);

    useEffect(() => {
        setFlexStyle({ flexDirection, flexWrap, justifyContent, alignItems });
    }, [ flexDirection, flexWrap, justifyContent, alignItems, setFlexStyle ]);

    return (
        <div
            className={s.flex}
            style={flexStyle}
        >
            {children}
        </div>
    );
}