import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import styles from './ImageAttr.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import shortid from 'shortid';
import Store from '../../../store/Store';
import actions from '../../../store/actions';
import { configService } from '../../../index';
import { createImageFileName, getImagePath } from '../../../js/shared';
import { icons, images } from '../../../js/generated';

ImageAttr.propTypes = {
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


export default function ImageAttr(props) {
    const { state, dispatch } = useContext(Store);
    const config = configService.getProps();

    const [ hasLoaded, setHasLoaded ] = useState(false);
    const [ sizeBy, setSizeBy ] = useState('width');
    const [ id ] = useState(() => shortid.generate());

    const image = useRef(null);

    const calcSizeBy = useCallback(
        (imageWidth, imageHeight, boxWidth, boxHeight) => {
            setSizeBy(
                (imageWidth / imageHeight) / (boxWidth / boxHeight) < 1 ? 'width' : 'height'
            );
        },
        []
    );

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading(id));
            }
        },
        [ props.doNotSubscribeToGlobalLoading, dispatch, id ]);

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const { width, height } = image.current.getBoundingClientRect();
        calcSizeBy(width, height, props.width, props.height);
    }, [ props.width, props.height, calcSizeBy ]);

    let sizes = '';
    let srcSet = '';
    const segments = props.source.split('/');
    const imageName = segments.pop();
    images.optionList.splice(images.optionList.indexOf(images.optionList.find(entry => entry.method !== 'scale')), 1);
    [ ...images.optionList ].reverse().forEach((entry, index)=> {
        sizes += `(min-width: ${entry.width}px) ${entry.width}px${index < images.optionList.length - 1 ? ', ' : `, ${props.width / state.viewportWidth * 100}vw`}`;
    });
    images.optionList.forEach((entry, index)=> {
        const imageFileName = createImageFileName(imageName, entry);
        const optimalSource = getImagePath(images.targetPath, imageFileName);
        srcSet += `${optimalSource} ${entry.width}w${index < images.optionList.length - 1 ? ', ' : ''}`;
    });

    return (
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
                    opacity: hasLoaded ? '1' : '0',
                    transition: `opacity ${config.fadeInTime}s`,
                    [sizeBy]: '100%'
                }}
                alt={props.source}
                src={props.source}
                sizes={sizes}
                srcSet={srcSet}
                onLoad={event => {
                    if (typeof props.onLoaded === 'function') {
                        props.onLoaded();
                    }
                    if (!props.doNotSubscribeToGlobalLoading) {
                        dispatch(actions.stopLoading(id));
                    }
                    calcSizeBy(event.target.width, event.target.height, props.width, props.height);
                    setHasLoaded(true);
                }}
            />
        </div>
    );
}
