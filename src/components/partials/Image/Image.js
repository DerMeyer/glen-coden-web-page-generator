import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store, { actions, targetImageSizes } from '../../../Store';
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

    const [hasLoaded, setHasLoaded] = useState(false);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [targetSize, setTargetSize] = useState(0);

    const getDisplayToImageRatio = useCallback(
        () => {
            const displayDelta = props.width / props.height;
            const originalDelta = originalSize.width / originalSize.height;
            if (Number.isNaN(displayDelta) || Number.isNaN(originalDelta)) {
                return 1;
            }
            return displayDelta / originalDelta;
        },
        [props.width, props.height, originalSize]
    );

    const getSource = useCallback(
        (width, fallback = false) => {
            const targetWidth = width * Math.max(1 / getDisplayToImageRatio(), 1);
            console.log('TARGET WIDTH:', targetWidth);// TODO remove dev code
            const targetImageSize = targetImageSizes.find(size => size > targetWidth) || targetImageSizes[targetImageSizes.length - 1];
            const updatedSize = Math.max(targetImageSize, targetSize);

            if (updatedSize !== targetSize) {
                setTargetSize(updatedSize);
            }

            const sourceParts = props.source.split('.');
            const sourceType = sourceParts.pop();
            const sourceName = sourceParts.join('.');
            let updatedSource = `${projectConfig.name}/images/optimized/${sourceName}_${updatedSize}.${sourceType}`;

            if (fallback) {
                updatedSource = `${projectConfig.name}/images/${props.source}`;
            }

            console.log('INNER WIDTH:', window.innerWidth);// TODO remove dev code
            console.log('UPDATED SOURCE:', updatedSource);// TODO remove dev code
            return updatedSource;
        },
        [props.source, targetSize, getDisplayToImageRatio]
    );

    const [source, setSource] = useState(() => getSource(props.width));

    useEffect(() => {
        setHasLoaded(false);
    }, [source]);

    useEffect(() => {
        const updatedSource = getSource(props.width);
        setSource(updatedSource);
    }, [props.width, props.height, getSource]);

    useEffect(() => {
        if (!props.doNotSubscribeToGlobalLoading) {
            dispatch(actions.startLoading());
        }
    }, [dispatch, props.doNotSubscribeToGlobalLoading]);

    const onLoad = () => {
        setOriginalSize({ width: image.current.offsetWidth, height: image.current.offsetHeight });
        setHasLoaded(true);
        if (!props.doNotSubscribeToGlobalLoading) {
            dispatch(actions.stopLoading());
        }
    };

    const onError = () => {
        console.warn(`Missing an optimized image for ${props.source}`);
        const fallbackSource = getSource(props.width, true);
        setSource(fallbackSource);
    };

    const getImageSizing = () => {
        if (!hasLoaded) {
            return {};
        }
        return getDisplayToImageRatio() >= 1
            ? { width: '100%' }
            : { height: '100%' };
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
                    ...getImageSizing(),
                    opacity: hasLoaded ? '1' : '0',
                    transition: `opacity ${projectConfig.fadeInTime}s`
                }}
                src={source}
                onLoad={onLoad}
                onError={onError}
                alt=""
            />
        </div>
    );
}