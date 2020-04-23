import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './ItemBar.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../../store/Store';

ItemBar.propTypes = {
    className: PropTypes.string,
    justifyContent: PropTypes.string,
    alignItems: PropTypes.string,
    stretchFactor: PropTypes.number,
    vertical: PropTypes.bool
};

const widthStretch = 1.5;
const heightStretch = 1.3;


export default function ItemBar(props) {
    const { state } = useContext(Store);

    const stretchWidthBy = widthStretch * (props.stretchFactor || 1);
    const stretchHeightBy = heightStretch * (props.stretchFactor || 1);

    const [ calcWidth, setCalcWidth ] = useState(0);
    const [ calcHeight, setCalcHeight ] = useState(0);

    const itemBar = useRef(null);

    useEffect(() => {
        setCalcWidth(0);
        setCalcHeight(0);
    }, [ state.viewportWidth, state.viewportHeight ]);

    useEffect(() => {
        if (calcWidth === 0) {
            const updatedWidth = props.vertical || props.children.length === 1
                ? itemBar.current.offsetWidth
                : itemBar.current.offsetWidth * stretchWidthBy;
            setCalcWidth(updatedWidth);
        }
        if (calcHeight === 0) {
            const updatedHeight = !props.vertical || props.children.length === 1
                ? itemBar.current.offsetHeight
                : itemBar.current.offsetHeight * stretchHeightBy;
            setCalcHeight(updatedHeight);
        }
    }, [ calcWidth, calcHeight, stretchWidthBy, stretchHeightBy, props.vertical, props.children ]);

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
            style={{
                height: `${boxHeight}px`,
                ...(props.style || {})
            }}
        >
            <div
                ref={itemBar}
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