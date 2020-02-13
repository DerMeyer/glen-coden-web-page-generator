import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './ImageCss.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store from '../../../js/Store';
import actions from '../../../js/actions';
import { targetImageSizes } from '../../../js/helpers';
import { configService } from '../../../index';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    doNotSubscribeToGlobalLoading: PropTypes.bool
};


export default function ImageCss(props) {
    const { dispatch } = useContext(Store);

    const [projectConfig] = useState(() => configService.getProjectConfig());

    const [source, setSource] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [targetSize, setTargetSize] = useState(0);

    const getSource = useCallback(
        (width, fallback = false) => {
            if (fallback) {
                return `${projectConfig.name}/images/${props.source}`;
            }
            const targetImageSize = targetImageSizes.find(size => size > width) || targetImageSizes[targetImageSizes.length - 1];
            if (targetImageSize <= targetSize) {
                return source;
            }
            setTargetSize(targetImageSize);
            const sourceParts = props.source.split('.');
            const sourceType = sourceParts.pop();
            const sourceName = sourceParts.join('.');
            return `${projectConfig.name}/images/optimized/${sourceName}_${targetImageSize}.${sourceType}`;
        },
        [props.source, projectConfig.name, source, targetSize]
    );

    const onLoad = () => {
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

    useEffect(() => {
            if (!source) {
                return;
            }
            console.log('IMAGE SOURCE HAS CHANGED:', source);// TODO remove dev code
            setHasLoaded(false);
            const img = new Image();
            img.onload = onLoad;
            img.onerror = onError;
            img.src = source;
        },
        [source]);

    useEffect(() => {
            const updatedSource = getSource(props.width);
            setSource(updatedSource);
        },
        [props.width, props.height, getSource]);

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading());
            }
        },
        [dispatch, props.doNotSubscribeToGlobalLoading]);

    return (
        <div
            className={cx(styles.image, { [props.className]: props.className })}
            style={{
                ...props.style,
                backgroundImage: `url(${source})`,
                width: props.width,
                height: props.height,
                opacity: hasLoaded ? '1' : '0',
                transition: `opacity ${projectConfig.fadeInTime}s${props.style.transition ? `, ${props.style.transition}` : ''}`
            }}
        />
    );
}