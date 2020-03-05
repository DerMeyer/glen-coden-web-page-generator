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
    loadWithCss: PropTypes.bool,
    doNotSubscribeToGlobalLoading: PropTypes.bool
};


export default function Image(props) {
    const { dispatch } = useContext(Store);

    const image = useRef(null);

    const [projectConfig] = useState(() => configService.getProjectConfig());

    const [source, setSource] = useState('');
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
            const fallbackSource = `images/${props.source}`;
            if (fallback) {
                return fallbackSource;
            }

            let targetImageRatio = 'default';
            const targetWidth = width * Math.max(1 / getDisplayToImageRatio(), 1);

            if (projectConfig.usePortraitImages && (props.width < projectConfig.maxPortraitWidth) && (props.width / props.height < 0.8)) {
                targetImageRatio = 'portrait';
            }

            const sizesForRatio = targetImageSizes.filter(size => size.ratio === targetImageRatio).map(size => size.width);
            const targetImageSize = sizesForRatio.find(size => targetWidth < size) || sizesForRatio.pop();
            const ratioChanged = !source.includes(targetImageRatio) && source !==  fallbackSource;

            if (targetImageSize <= targetSize && !ratioChanged) {
                return source;
            }
            setTargetSize(targetImageSize);

            const sourceParts = props.source.split('.');
            const sourceType = sourceParts.pop();
            const sourceName = sourceParts.join('.');

            return `images/optimized/${sourceName}_${targetImageRatio}_${targetImageSize}.${sourceType}`;
        },
        [
            projectConfig.usePortraitImages,
            projectConfig.maxPortraitWidth,
            props.width,
            props.height,
            props.source,
            getDisplayToImageRatio,
            targetSize,
            source
        ]
    );

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading());
            }
        },
        [dispatch, props.doNotSubscribeToGlobalLoading]);

    useEffect(() => {
            const updatedSource = getSource(props.width);
            setSource(updatedSource);
        },
        [props.width, props.height, getSource]);

    useEffect(() => setHasLoaded(false), [source]);

    const onLoad = useCallback(
        () => {
            setOriginalSize({ width: image.current.offsetWidth, height: image.current.offsetHeight });
            setHasLoaded(true);
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading());
            }
        },
        [dispatch, props.doNotSubscribeToGlobalLoading]
    );

    const onError = useCallback(
        () => {
            console.warn(`Missing an optimized image for ${props.source}`);
            const fallbackSource = getSource(props.width, true);
            setSource(fallbackSource);
        },
        [props.source, getSource, props.width]
    );

    const getImageSizing = () => {
        if (!hasLoaded) {
            return {};
        }
        return getDisplayToImageRatio() >= 1
            ? { width: '100%' }
            : { height: '100%' };
    };

    return props.loadWithCss
        ? (
            <div
                className={cx(styles.imageBoxCss, { [props.className]: props.className })}
                style={{
                    ...props.style,
                    backgroundImage: `url(${source})`,
                    width: props.width,
                    height: props.height,
                    opacity: hasLoaded ? '1' : '0',
                    transition: `opacity ${projectConfig.fadeInTime}s${props.style.transition ? `, ${props.style.transition}` : ''}`
                }}
            >
                <img
                    ref={image}
                    className={styles.imageCss}
                    src={source}
                    onLoad={onLoad}
                    onError={onError}
                    alt=""
                />
            </div>
        ) : (
            <div
                className={cx(styles.imageBox, { [props.className]: props.className })}
                style={{
                    ...props.style,
                    width: props.width,
                    height: props.height
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