import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import useOptimalSource from '../../../hooks/useOptimalSource';
import useGlobalLoading from '../../../hooks/useGlobalLoading';


export default function Image({ source, width, height, ratio, className, css, subscribeToGlobalLoading, loadAfterGlobalLoading }) {
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
        if (!width && !height && image.current !== null) {
            const element = image.current.getBoundingClientRect();
            requestOptimalSource(source, element.width, element.height, ratio);
        }
        requestOptimalSource(source, width, height, ratio);
    }, [ loadAfterGlobalLoading, doneGL, requestOptimalSource, source, width, height, ratio ]);

    useEffect(() => {
        if (!image.current) {
            return;
        }
        const element = image.current.getBoundingClientRect();
        calcSizeBy(element.width, element.height, width, height);
    }, [ calcSizeBy, width, height ]);

    const boxStyle = { ...css } || {};
    if (width) {
        boxStyle.width = `${width}px`;
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