import React from 'react';


export default function Input({ name, formData, onChange, onFocus, onBlur, inputStyles }) {
    return (
        <input
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