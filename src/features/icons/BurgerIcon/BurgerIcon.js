import React from 'react';
import s from './BurgerIcon.module.css';
import cx from 'classnames';
import PropTypes from 'prop-types';

BurgerIcon.propTypes = {
    close: PropTypes.bool,
    color: PropTypes.string,
    transitionTime: PropTypes.number,
    strokeWidth: PropTypes.number
};


export default function BurgerIcon({ close, color = '#000', transitionTime = 0.5, strokeWidth = 4 }) {
    return (
        <div
            className={cx(s.BurgerIcon, { [s.close]: close })}
            style={{ transition: `${transitionTime}s ease` }}
        >
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
            <span style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
        </div>
    );
}