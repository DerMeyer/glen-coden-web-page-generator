import React from 'react';
import s from './CloseIcon.module.css';


export default function CloseIcon({ color, size  = 18, strokeWidth = 3 }) {
    return (
        <div
            className={s.CloseIcon}
            style={{
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            <div
                className={s.StrokeOne}
                style={{
                    width: `${size * 1.42}px`,
                    height: `${strokeWidth}px`,
                    backgroundColor: color
                }}
            />
            <div
                className={s.StrokeTwo}
                style={{
                    width: `${size * 1.42}px`,
                    height: `${strokeWidth}px`,
                    backgroundColor: color
                }}
            />
        </div>
    );
}