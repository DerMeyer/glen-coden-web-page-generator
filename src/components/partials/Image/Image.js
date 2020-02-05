import React, { useContext, useRef, useState, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store, { actions } from '../../../Store';
import { projectConfig } from '../../../index';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    doNotSubscribeToGlobalLoading: PropTypes.bool
};


export default function Image(props) {
    const { dispatch } = useContext(Store);

    const image = useRef(null);

    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [hasLoaded, setHasLoaded] = useState(false);

    const getImageSize = () => {
        if (!hasLoaded) {
            return {};
        }
        const targetDelta = props.width / props.height;
        const originalDelta = originalSize.width / originalSize.height;
        return targetDelta > originalDelta
            ? { width: '100%' }
            : { height: '100%' };
    };

    useEffect(() => {
        if (!props.doNotSubscribeToGlobalLoading) {
            dispatch(actions.startLoading());
        }
    }, []);

    const onLoad = () => {
        setOriginalSize({ width: image.current.offsetWidth, height: image.current.offsetHeight });
        window.setTimeout(() => {
            setHasLoaded(true);
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading());
            }
        }, 3000); // TODO remove dev code
    };

    return (
        <div
            className={cx(styles.imageBox, { [props.className]: props.className })}
            style={{
                width: props.width,
                height: props.height,
                ...props.style
            }}
        >
            <img
                ref={image}
                className={styles.image}
                style={{
                    ...getImageSize(),
                    opacity: hasLoaded ? '1' : '0',
                    transition: `opacity ${projectConfig.global.fadeInTimeOnLoaded}s`
                }}
                src={props.source}
                onLoad={onLoad}
                alt=""
            />
        </div>
    );
}