import React from 'react';
import s from './ThreeDotsLoadingIcon.module.css';
import PropTypes from 'prop-types';

ThreeDotsLoadingIcon.propTypes = {
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
};


export default function ThreeDotsLoadingIcon({ size, color }) {
    return (
        <div
            className={s.iconBox}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <div className={`${s.dot} ${s.dotOne}`} style={{ backgroundColor: color }}/>
            <div className={`${s.dot} ${s.dotTwo}`} style={{ backgroundColor: color }}/>
            <div className={`${s.dot} ${s.dotThree}`} style={{ backgroundColor: color }}/>
        </div>
    );
}