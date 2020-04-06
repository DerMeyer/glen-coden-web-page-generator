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

const imagesDir = 'images';


export default function Image(props) {
    const { dispatch } = useContext(Store);
    const config = configService.getConfig();

    const [ source, setSource ] = useState('');
    const [ errors, setErrors ] = useState([]);

    const image = useRef(null);

    const getSource = useCallback(
        (width, height, errorList) => {
            const sourceParts = props.source.split('.');
            const sourceType = sourceParts.pop();
            const sourceName = sourceParts.join('.');

            const maxPortraitWidth = targetImageSizes
                .filter(entry => entry.ratio === 'portrait')
                .reduce((result, entry) => Math.max(result, entry.width), 0);

            const imageRatio = config.usePortraitImages && (width < maxPortraitWidth) && (width / height < 0.8)
                ? 'portrait'
                : 'default';

            const sizesForRatio = targetImageSizes.filter(entry => entry.ratio === imageRatio);
            const targetSize = sizesForRatio.find(entry => width < entry.width) || sizesForRatio.pop();
            const targetWidth = targetSize.width;

            const updatedSource = `${imagesDir}/optimized/${sourceName}_${imageRatio}_${targetWidth}.${sourceType}`;

            if (errorList.includes(updatedSource)) {
                return `${imagesDir}/${props.source}`;
            }
            return updatedSource;
        },
        [ props.source, config ]
    );

    useEffect(() => {
            const updatedSource = getSource(props.width, props.height, errors);
            setSource(updatedSource);
        },
        [ props.width, props.height, errors, getSource ]);

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading());
            }
        },
        [ props.doNotSubscribeToGlobalLoading, dispatch ]);

    const onLoad = useCallback(
        () => {
            if (typeof props.onLoaded === 'function') {
                props.onLoaded();
            }
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading());
            }
        },
        [ props, dispatch ]
    );

    const onError = useCallback(
        () => {
            console.warn(`Missing an optimized image for ${source}`);
            setErrors(prevState => [ ...prevState, source ]);
        },
        [ source ]
    );

    const hasLoaded = image.current && image.current.complete;
    const delta = hasLoaded ? (props.width / props.height) / (image.current.offsetWidth / image.current.offsetHeight) : 1;
    const imageSizing = delta >= 1 ? { width: '100%' } : { height: '100%' };

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
                        alt={source}
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
                        ...imageSizing,
                        opacity: hasLoaded ? '1' : '0',
                        transition: `opacity ${config.fadeInTime}s`
                    }}
                    src={source}
                    onLoad={onLoad}
                    onError={onError}
                    alt={source}
                />
            )}
        </div>
    );
}