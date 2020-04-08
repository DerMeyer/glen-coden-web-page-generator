import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../../js/Store';
import actions from '../../../js/actions';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes } from '../../../js/helpers';
import { createImageFileName, getImagePath } from '../../../js/shared';

import { icons, images } from '../../../js/generated';

const optimizations = {
    icons,
    images
};

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    onLoaded: PropTypes.func,
    doNotSubscribeToGlobalLoading: PropTypes.bool
};

const ImageRatios = {
    ORIGINAL: 'original',
    PORTRAIT: 'portrait'
};

const optionsFilter = {
    [ImageRatios.ORIGINAL]: options => options.filter(option => !(option.height > option.width)),
    [ImageRatios.PORTRAIT]: options => options.filter(option => option.height > option.width)
};


export default function Image(props) {
    const { state, dispatch } = useContext(Store);
    const config = configService.getConfig();

    const [ source, setSource ] = useState('');
    const [ errors, setErrors ] = useState([]);

    const image = useRef(null);

    const getOptimizedSource = useCallback(
        (width, height, errorList) => {
            const sourcePath = props.source.split('/');

            if (sourcePath.length !== 2) {
                return props.source;
            }
            const [ assetType, asset ] = sourcePath;

            const imageRatio = config.usePortraitImages && state.deviceType === DeviceTypes.MOBILE && state.orientationType === OrientationTypes.PORTRAIT
                ? ImageRatios.PORTRAIT
                : ImageRatios.ORIGINAL;

            const OPTIMIZE_CONFIG = optimizations[assetType];

            if (!OPTIMIZE_CONFIG) {
                return props.source;
            }
            const optionList = optionsFilter[imageRatio](OPTIMIZE_CONFIG.optionList);
            const options = optionList.find(entry => entry.width >= width) || optionList.pop();
            const targetPath = OPTIMIZE_CONFIG.targetPath;

            const assetName = createImageFileName(asset, options);
            const updatedSource = getImagePath(assetName, targetPath);

            if (errorList.includes(updatedSource)) {
                return props.source;
            }
            return updatedSource;
        },
        [ props.source, state.deviceType, state.orientationType, config ]
    );

    useEffect(() => {
            const updatedSource = getOptimizedSource(props.width, props.height, errors);
            setSource(updatedSource);
        },
        [ props.width, props.height, props.source, errors, getOptimizedSource ]);

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