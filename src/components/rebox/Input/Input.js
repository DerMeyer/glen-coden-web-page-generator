import React from 'react';


export default function Input({ name, defaultValue }) {
    return (
        <input
            id={name}
            name={name}
            defaultValue={defaultValue}
        />
    );
}