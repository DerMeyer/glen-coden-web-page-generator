import React from 'react';
import s from './Input.module.css';


export default function Input({ name, formData, onChange, onFocus, onBlur, inputStyles }) {
    return (
        <input
            className={s.Input}
            id={name}
            name={name}
            value={formData[name]}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            style={inputStyles[name]}
        />
    );
}