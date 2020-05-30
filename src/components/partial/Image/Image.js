import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import useOptimalSource from '../../../hooks/useOptimalSource';
import useGlobalLoading from '../../../hooks/useGlobalLoading';


export default function Image({ source, width, height, className, style, subscribeToGlobalLoading, loadAfterGlobalLoading }) {
    const image = useRef(null);

    const [ sizeBy, setSizeBy ] = useState('width');

    const [ startLoading, stopLoading ] = useGlobalLoading(subscribeToGlobalLoading);
    const [ optimalSource, requestOptimalSource ] = useOptimalSource();

    useEffect(startLoading, [ startLoading ]);

    useEffect(() => {
        requestOptimalSource(source, width, height);
    }, [ requestOptimalSource, source, width, height ]);

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

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const { w, h } = image.current.getBoundingClientRect();
        calcSizeBy(w, h, width, height);
    }, [ calcSizeBy, width, height ]);

    const onLoad = useCallback(
        event => {
            stopLoading();
            calcSizeBy(event.target.width, event.target.height, width, height);
        },
        [ stopLoading, calcSizeBy, width, height ]
    );

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