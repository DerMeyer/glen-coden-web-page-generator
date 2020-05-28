import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import shortid from 'shortid';
import Store from '../../../store/Store';
import actions from '../../../store/actions';
import { configService } from '../../../index';
import useOptimalSource from '../../../hooks/useOptimalSource';

Image.propTypes = {
    source: PropTypes.string, // TODO deal with empty value
    width: PropTypes.number, // TODO deal with empty value
    height: PropTypes.number, // TODO deal with empty value
    className: PropTypes.string,
    style: PropTypes.object,
    setSourceDirectly: PropTypes.bool,
    onLoaded: PropTypes.func,
    doNotSubscribeToGlobalLoading: PropTypes.bool,
    loadAfterGlobalLoading: PropTypes.bool // TODO implement
};


export default function Image(props) {
    const { dispatch } = useContext(Store);
    const config = configService.getConfig();

    const [ source, requestOptimalSource ] = useOptimalSource();

    const [ hasLoaded, setHasLoaded ] = useState(false);
    const [ sizeBy, setSizeBy ] = useState('width');
    const [ id ] = useState(() => shortid.generate());

    const image = useRef(null);

    useEffect(() => {
        requestOptimalSource(props.source, props.width, props.height);
    }, [ requestOptimalSource, props.source, props.width, props.height ]);

    useEffect(() => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.startLoading(id));
            }
        },
        [ props.doNotSubscribeToGlobalLoading, dispatch, id ]);

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

    const onLoad = useCallback(
        event => {
            if (!props.doNotSubscribeToGlobalLoading) {
                dispatch(actions.stopLoading(id));
            }
            setHasLoaded(true);
            calcSizeBy(event.target.width, event.target.height, props.width, props.height);
        },
        [ dispatch, props.doNotSubscribeToGlobalLoading, id, calcSizeBy, props.width, props.height ]
    );

    useEffect(() => { console.log('OPTIMAL SRC: ', source); }, [ source ]); // TODO remove dev code

    return (
        <div
            className={cx(s.imageBox, { [props.className]: props.className })}
            style={{
                ...props.style,
                width: props.width,
                height: props.height
            }}
        >
            {source && (
                <img
                    ref={image}
                    className={s.image}
                    style={{
                        opacity: hasLoaded ? '1' : '0.5',
                        transition: `opacity ${config.fadeInTime}s`,
                        [sizeBy]: '100%'
                    }}
                    src={source}
                    alt={source}
                    onLoad={onLoad}
                />
            )}
        </div>
    );
}