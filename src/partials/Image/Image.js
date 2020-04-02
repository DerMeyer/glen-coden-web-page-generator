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
    const [ config ] = useState(() => configService.getProjectConfig());

    const image = useRef(null);

    const [ sourceType, setSourceType ] = useState('');
    const [ sourceName, setSourceName ] = useState('');

    useEffect(() => {
        const sourceParts = props.source.split('.');
        const sourceType = sourceParts.pop();
        const sourceName = sourceParts.join('.');
        setSourceType(sourceType);
        setSourceName(sourceName);
    }, [ props.source ]);

    const [ maxPortraitWidth, setMaxPortraitWidth ] = useState(0);

    useEffect(() => {
        const maxPortraitWidth = targetImageSizes
            .filter(entry => entry.ratio === 'portrait')
            .reduce((result, entry) => Math.max(result, entry.width), 0);
        setMaxPortraitWidth(maxPortraitWidth);
    }, []);

    const imageRatio = config.usePortraitImages && (props.width < maxPortraitWidth) && (props.width / props.height < 0.8)
        ? 'portrait'
        : 'default';

    const [ targetWidth, setTargetWidth ] = useState(0);

    useEffect(() => {
        const sizesForRatio = targetImageSizes.filter(entry => entry.ratio === imageRatio);
        const targetImageSize = sizesForRatio.find(entry => props.width < entry.width) || sizesForRatio.pop();
        setTargetWidth(targetImageSize.width);
    }, [ props.width, imageRatio ]);

    const [ isFallback, setIsFallback ] = useState(false);

    const source = isFallback
        ? `images/${props.source}`
        : `images/optimized/${sourceName}_${imageRatio}_${targetWidth}.${sourceType}`;

    const [ hasLoaded, setHasLoaded ] = useState(false);

    useEffect(() => {
        setHasLoaded(false);
    }, [ source ]);

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading());
            }
        },
        [ props.doNotSubscribeToGlobalLoading, dispatch ]);

    const [ originalSize, setOriginalSize ] = useState({ width: 0, height: 0 });

    const onLoad = useCallback(
        () => {
            setOriginalSize({ width: image.current.offsetWidth, height: image.current.offsetHeight });
            if (typeof props.onLoaded === 'function') {
                props.onLoaded();
            }
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading());
            }
            setHasLoaded(true);
        },
        [ props, dispatch ]
    );

    const onError = useCallback(
        () => {
            console.warn(`Missing an optimized image for ${props.source}`);
            setIsFallback(true);
        },
        [ props.source ]
    );

    const getImageSizing = () => {
        if (!hasLoaded) {
            return {};
        }
        const displayDelta = props.width / props.height;
        const originalDelta = originalSize.width / originalSize.height;
        const delta = (Number.isNaN(displayDelta) || Number.isNaN(originalDelta)) ? 1 : (displayDelta / originalDelta);
        return delta >= 1
            ? { width: '100%' }
            : { height: '100%' };
    };

    const hasSource = isFallback || (sourceName && imageRatio && targetWidth && sourceType);

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
                {hasSource && (
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
            {hasSource && (
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