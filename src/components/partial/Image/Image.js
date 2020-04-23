import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import shortid from 'shortid';
import Store from '../../../store/Store';
import actions from '../../../store/actions';
import { configService } from '../../../index';
import { createImageFileName, getImagePath } from '../../../js/shared';
import { icons, images } from '../../../js/generated';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    setSourceDirectly: PropTypes.bool,
    onLoaded: PropTypes.func,
    doNotSubscribeToGlobalLoading: PropTypes.bool,
    loadAfterGlobalLoading: PropTypes.bool // TODO implement
};

const optimizedSources = {
    [getImagePath(icons.sourcePath)]: icons,
    [getImagePath(images.sourcePath)]: images
};

const ImageRatios = {
    ORIGINAL: 'original',
    PORTRAIT: 'portrait'
};

const optionsFilter = {
    [ImageRatios.ORIGINAL]: options => options.filter(option => option.method === 'scale'),
    [ImageRatios.PORTRAIT]: options => options.filter(option => option.method === 'cover' && option.height > option.width)
};


export default function Image(props) {
    const { dispatch } = useContext(Store);
    const config = configService.getConfig();

    const [ source, setSource ] = useState('');
    const [ hasLoaded, setHasLoaded ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ , setMaxRequestedWidth ] = useState(0);
    const [ id ] = useState(() => shortid.generate());

    const image = useRef(null);

    const imageRatio = config.usePortraitImages && props.width / props.height < 0.8
        ? ImageRatios.PORTRAIT
        : ImageRatios.ORIGINAL;

    const getOptimalSource = useCallback(
        (width, height, rawSource, errorList) => {
            const segments = rawSource.split('/');
            const imageName = segments.pop();
            const imagePath = `${segments.join('/')}/`;

            const OPTIMIZE_CONFIG = optimizedSources[imagePath];

            if (!OPTIMIZE_CONFIG) {
                return rawSource;
            }

            let optionList = optionsFilter[imageRatio](OPTIMIZE_CONFIG.optionList);
            if (!optionList.length) {
                optionList = optionsFilter[ImageRatios.ORIGINAL](OPTIMIZE_CONFIG.optionList);
            }
            const options = optionList.find(entry => entry.width >= width) || optionList.pop();

            const imageFileName = createImageFileName(imageName, options);
            const optimalSource = getImagePath(OPTIMIZE_CONFIG.targetPath, imageFileName);

            if (errorList.includes(optimalSource)) {
                return rawSource;
            }

            return optimalSource;
        },
        [ imageRatio ]
    );

    useEffect(() => {
        if (props.setSourceDirectly) {
            setSource(props.source);
            return;
        }
        setMaxRequestedWidth(prevState => {
            if (props.width <= prevState && imageRatio !== ImageRatios.PORTRAIT) {
                return prevState;
            }
            const optimalSource = getOptimalSource(props.width, props.height, props.source, errors);
            if (optimalSource === source) {
                return props.width;
            }
            const img = new window.Image();
            img.onload = () => {
                setSource(prevSource => {
                    if (optimalSource === prevSource) {
                        return prevSource;
                    }
                    if (typeof props.onLoaded === 'function') {
                        props.onLoaded();
                    }
                    if (!props.doNotSubscribeToGlobalLoading) {
                        dispatch(actions.stopLoading(id));
                    }
                    return optimalSource;
                });
                setHasLoaded(true);
            };
            img.onerror = () => {
                setErrors(prevErrors => {
                    if (prevErrors.includes(source)) {
                        return [ ...prevErrors ];
                    }
                    console.warn(`Missing an optimized image for ${source}`);
                    return [ ...prevErrors, source ];
                });
            };
            setHasLoaded(false);
            img.src = optimalSource;
            return props.width;
        });
    },
    [ props, dispatch, source, errors, id, imageRatio, getOptimalSource ]);

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading(id));
            }
        },
        [ props.doNotSubscribeToGlobalLoading, dispatch, id ]);

    const [ sizeBy, setSizeBy ] = useState('width');

    const calcSizeBy = useCallback(
        (imageWidth, imageHeight, boxWidth, boxHeight) => {
            setSizeBy(
                (imageWidth / imageHeight) / (boxWidth / boxHeight) < 1 ? 'width' : 'height'
            );
        },
        []
    );

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const { width, height } = image.current.getBoundingClientRect();
        calcSizeBy(width, height, props.width, props.height);
    }, [ props.width, props.height, calcSizeBy ]);

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
                        opacity: hasLoaded ? '1' : '0',
                        transition: `opacity ${config.fadeInTime}s`,
                        [sizeBy]: '100%'
                    }}
                    src={source}
                    alt={source}
                    onLoad={event => calcSizeBy(event.target.width, event.target.height, props.width, props.height)}
                />
            )}
        </div>
    );
}