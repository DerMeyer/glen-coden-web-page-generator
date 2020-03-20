import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './ItemBar.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../js/Store';

ItemBar.propTypes = {
    className: PropTypes.string,
    justifyContent: PropTypes.string,
    alignItems: PropTypes.string,
    stretchFactor: PropTypes.number,
    vertical: PropTypes.bool
};

const widthStretchFactor = 1.5;
const heightStrechFactor = 1.3;


export default function ItemBar(props) {
    const { globalState } = useContext(Store);

    const stretchWidthBy = widthStretchFactor * (props.stretchFactor || 1);
    const stretchHeightBy = heightStrechFactor * (props.stretchFactor || 1);

    const [calcWidth, setCalcWidth] = useState(0);
    const [calcHeight, setCalcHeight] = useState(0);

    const navBarRef = useRef(null);

    useEffect(() => {
        setCalcWidth(0);
        setCalcHeight(0);
    }, [globalState.viewportWidth, globalState.viewportHeight]);

    useEffect(() => {
        if (calcWidth === 0) {
            const updatedWidth = props.vertical
                ? navBarRef.current.offsetWidth
                : navBarRef.current.offsetWidth * stretchWidthBy;
            setCalcWidth(updatedWidth);
        }
        if (calcHeight === 0) {
            const updatedHeight = props.vertical
                ? navBarRef.current.offsetHeight * stretchHeightBy
                : navBarRef.current.offsetHeight;
            setCalcHeight(updatedHeight);
        }
    }, [calcWidth, calcHeight, stretchWidthBy, stretchHeightBy, props.vertical]);

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

    const boxHeight = props.vertical
        ? calcHeight / stretchHeightBy / Math.max(props.children.length, 1)
        : calcHeight;

    return (
        <div
            className={styles.itemBarBox}
            style={{ height: `${boxHeight}px` }}
        >
            <div
                ref={navBarRef}
                className={cx(styles.itemBar, {
                    [props.className]: props.className,
                    [styles.vertical]: props.vertical
                })}
                style={style}
            >
                {props.children}
            </div>
        </div>
    );
}