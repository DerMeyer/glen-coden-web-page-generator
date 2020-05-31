import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import useOptimalSource from '../../../hooks/useOptimalSource';
import useGlobalLoading from '../../../hooks/useGlobalLoading';


export default function Image({ source, width, height, className, style, subscribeToGlobalLoading, loadAfterGlobalLoading }) {
    const image = useRef(null);

    const [ sizeBy, setSizeBy ] = useState('width');

    const [ startLoading, stopLoading, hasLoaded ] = useGlobalLoading();
    const [ optimalSource, requestOptimalSource ] = useOptimalSource();

    const calcSizeBy = useCallback(
        (imgWidth, imgHeight, boxWidth, boxHeight) => {
            if (!boxHeight) {
                setSizeBy('width');
                return;
            }
            if (!boxWidth) {
                setSizeBy('height');
                return;
            }
            setSizeBy((imgWidth / imgHeight) / (boxWidth / boxHeight) < 1 ? 'width' : 'height');
        },
        []
    );

    const onLoad = useCallback(
        event => {
            stopLoading();
            calcSizeBy(event.target.width, event.target.height, width, height);
        },
        [ stopLoading, calcSizeBy, width, height ]
    );

    useEffect(() => {
        if (subscribeToGlobalLoading) {
            startLoading();
        }
    }, [ startLoading, subscribeToGlobalLoading ]);

    useEffect(() => {
        if (loadAfterGlobalLoading && !hasLoaded) {
            return;
        }
        requestOptimalSource(source, width, height);
    }, [ loadAfterGlobalLoading, hasLoaded, requestOptimalSource, source, width, height ]);

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const element = image.current.getBoundingClientRect();
        calcSizeBy(element.width, element.height, width, height);
    }, [ calcSizeBy, width, height ]);

    return (
        <div
            className={`${s.imageBox}${className ? ` ${className}` : ''}`}
            style={{
                ...(style || {}),
                width,
                height
            }}
        >
            {optimalSource && (
                <img
                    ref={image}
                    className={s.image}
                    style={{ [sizeBy]: '100%' }}
                    src={optimalSource}
                    alt={optimalSource}
                    onLoad={onLoad}
                />
            )}
        </div>
    );
}