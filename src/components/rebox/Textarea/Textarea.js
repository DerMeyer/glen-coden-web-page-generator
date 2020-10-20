import React, { useEffect } from 'react';
import s from './Textarea.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useTextStyle from '../../../hooks/useTextStyle';


export default function Textarea(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ textStyle, getTextStyle ] = useTextStyle(props);

    useEffect(() => {
        getBoxStyle(props);
        getTextStyle(props);
    });

    const { name, formData, onChange, onFocus, onBlur, inputStyles } = props;

    return (
        <textarea
            className={s.Textarea}
            id={name}
            name={name}
            value={formData[name]}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{
                ...boxStyle,
                ...textStyle,
                ...inputStyles[name]
            }}
        />
    );
}