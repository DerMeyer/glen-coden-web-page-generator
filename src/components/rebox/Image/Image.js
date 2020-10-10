import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import useOptimalSource from '../../../hooks/useOptimalSource';
import useGlobalLoading from '../../../hooks/useGlobalLoading';


export default function Image({ source, width, height, sourceRatio, className, css, subscribeToGlobalLoading, loadAfterGlobalLoading }) {
    const image = useRef(null);

    const [ sizeBy, setSizeBy ] = useState('width');

    const [ startGL, stopGL, doneGL ] = useGlobalLoading();
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
            stopGL();
            calcSizeBy(event.target.width, event.target.height, width, height);
        },
        [ stopGL, calcSizeBy, width, height ]
    );

    useEffect(() => {
        if (subscribeToGlobalLoading) {
            startGL();
        }
    }, [ startGL, subscribeToGlobalLoading ]);

    useEffect(() => {
        if (loadAfterGlobalLoading && !doneGL) {
            return;
        }
        if (typeof width !== 'number') {
            if (image.current) {
                const e = image.current.getBoundingClientRect();
                requestOptimalSource(source, e.width, e.height, sourceRatio);
                return;
            }
            requestOptimalSource(source);
            return;
        }
        requestOptimalSource(source, width, height, sourceRatio);
    }, [ loadAfterGlobalLoading, doneGL, requestOptimalSource, source, width, height, sourceRatio ]);

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const e = image.current.getBoundingClientRect();
        calcSizeBy(e.width, e.height, width, height);
    }, [ calcSizeBy, width, height ]);

    const boxStyle = { ...css } || {};
    if (width) {
        boxStyle.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height) {
        boxStyle.height = `${height}px`;
    }

    return (
        <div
            className={`${s.imageBox}${className ? ` ${className}` : ''}`}
            style={boxStyle}
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