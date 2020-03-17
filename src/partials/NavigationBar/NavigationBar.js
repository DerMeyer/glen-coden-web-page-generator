import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './NavigationBar.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../js/Store';

NavigationBar.propTypes = {
    className: PropTypes.string,
    justifyContent: PropTypes.string,
    alignItems: PropTypes.string,
    stretchFactor: PropTypes.number
};


export default function NavigationBar(props) {
    const { globalState } = useContext(Store);

    const [calcWidth, setCalcWidth] = useState(0);
    const [calcHeight, setCalcHeight] = useState(0);

    const navBarRef = useRef(null);

    useEffect(() => {
        setCalcWidth(0);
        setCalcHeight(0);
    }, [globalState.viewportWidth, globalState.viewportHeight]);

    useEffect(() => {
        if (calcWidth === 0) {
            const widthByContent = navBarRef.current.offsetWidth;
            setCalcWidth(widthByContent * 1.5 * (props.stretchFactor || 1));
        }
        if (calcHeight === 0) {
            const heightByContent = navBarRef.current.offsetHeight;
            setCalcHeight(heightByContent * 1.3 * (props.stretchFactor || 1));
        }
    }, [calcWidth, calcHeight, props.stretchFactor]);

    const style = {};

    if (calcWidth) {
        style.width = `${calcWidth}px`;
    }

    if (calcHeight) {
        style.height = `${calcHeight}px`;
    }

    if (props.justifyContent) {
        style.justifyContent = props.justifyContent;
    }

    if (props.alignItems) {
        style.alignItems = props.alignItems;
    }

    return (
        <div
            ref={navBarRef}
            className={cx(styles.navigationBar, { [props.className]: props.className })}
            style={style}
        >
            {props.children}
        </div>
    );
}