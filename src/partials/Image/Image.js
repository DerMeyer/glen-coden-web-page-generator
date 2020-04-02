import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../js/Store';
import actions from '../../js/actions';
import { targetImageSizes } from '../../js/generated';
import { configService } from '../../index';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onLoaded: PropTypes.func,
    loadWithCss: PropTypes.bool,
    doNotSubscribeToGlobalLoading: PropTypes.bool
};


export default function Image(props) {
    const { dispatch } = useContext(Store);
    const [config] = useState(() => configService.getProjectConfig());

    const image = useRef(null);

    const [source, setSource] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

    const getSource = useCallback(
        (width, height) => {
            const fallbackSource = `images/${props.source}`;
            if (isFallback) {
                return fallbackSource;
            }
            let targetImageRatio = 'default';
            if (config.usePortraitImages && (width < config.maxPortraitWidth) && (width / height < 0.8)) {
                targetImageRatio = 'portrait';
            }
            const sizesForRatio = targetImageSizes.filter(size => size.ratio === targetImageRatio).map(size => size.width);
            const targetImageWidth = sizesForRatio.find(size => width < size) || sizesForRatio.pop();
            const sourceParts = props.source.split('.');
            const sourceType = sourceParts.pop();
            const sourceName = sourceParts.join('.');

            return `images/optimized/${sourceName}_${targetImageRatio}_${targetImageWidth}.${sourceType}`;
        },
        [
            props.source,
            config.usePortraitImages,
            config.maxPortraitWidth,
            isFallback
        ]
    );

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading());
            }
        },
        [dispatch, props.doNotSubscribeToGlobalLoading]);

    useEffect(() => {
            setHasLoaded(false);
            const updatedSource = getSource(props.width, props.height);
            setSource(updatedSource);
        },
        [props.width, props.height, getSource]);

    const onLoad = useCallback(
        () => {
            setOriginalSize({ width: image.current.offsetWidth, height: image.current.offsetHeight });
            const callback = props.onLoaded;
            if (typeof callback === 'function') {
                callback();
            }
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading());
            }
            setHasLoaded(true);
        },
        [dispatch, props.onLoaded, props.doNotSubscribeToGlobalLoading]
    );

    const onError = useCallback(
        () => {
            console.warn(`Missing an optimized image for ${props.source}`);
            setIsFallback(true);
        },
        [props.source]
    );

    const getImageSizing = () => {
        if (!hasLoaded) {
            return {};
        }
        const displayDelta = props.width / props.height;
        const originalDelta = originalSize.width / originalSize.height;
        if (Number.isNaN(displayDelta) || Number.isNaN(originalDelta)) {
            return {};
        }
        return displayDelta / originalDelta >= 1
            ? { width: '100%' }
            : { height: '100%' };
    };

    if (props.loadWithCss) {
        return (
            <div
                className={cx(styles.imageBoxCss, { [props.className]: props.className })}
                style={{
                    ...props.style,
                    backgroundImage: `url(${source})`,
                    width: props.width,
                    height: props.height,
                    opacity: hasLoaded ? '1' : '0',
                    transition: `opacity ${config.fadeInTime}s${props.style.transition ? `, ${props.style.transition}` : ''}`
                }}
            >
                {source && (
                    <img
                        ref={image}
                        className={styles.imageCss}
                        src={source}
                        onLoad={onLoad}
                        onError={onError}
                        alt=""
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className={cx(styles.imageBox, { [props.className]: props.className })}
            style={{
                ...props.style,
                width: props.width,
                height: props.height
            }}
        >
            {source && (
                <img
                    ref={image}
                    className={styles.image}
                    style={{
                        ...getImageSizing(),
                        opacity: hasLoaded ? '1' : '0',
                        transition: `opacity ${config.fadeInTime}s`
                    }}
                    src={source}
                    onLoad={onLoad}
                    onError={onError}
                    alt="partials/"
                />
            )}
        </div>
    );
}