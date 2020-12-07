import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import useOptimalSource from '../../../hooks/useOptimalSource';
import useGlobalLoading from '../../../hooks/useGlobalLoading';


// width, height, src, srcRatio, targetRatio, awaitLoad, priority, css

// useSize

// subscribe
// update
// each case returns Promise that resolves to a source
// >> useImageService or usePromise?

export default function Image({ source, width, height, sourceRatio, targetRatio, className, css, subscribeToGlobalLoading, loadAfterGlobalLoading }) {
    const box = useRef(null);
    const image = useRef(null);

    const [ sizeBy, setSizeBy ] = useState('width');

    const [ startGL, stopGL, doneGL ] = useGlobalLoading();
    const [ optimalSource, requestOptimalSource ] = useOptimalSource();

    const calcSizeBy = useCallback(
        (imgWidth, imgHeight, boxWidth, boxHeight, targetRatio) => {
            if (!boxHeight) {
                setSizeBy(targetRatio < imgWidth / imgHeight ? 'height' : 'width');
                return;
            }
            if (!boxWidth) {
                setSizeBy(targetRatio > imgWidth / imgHeight ? 'width' : 'height');
                return;
            }
            setSizeBy((imgWidth / imgHeight) / (boxWidth / boxHeight) < 1 ? 'width' : 'height');
        },
        []
    );

    const onLoad = useCallback(
        event => {
            stopGL();
            calcSizeBy(event.target.width, event.target.height, width, height, targetRatio);
        },
        [ stopGL, calcSizeBy, width, height, targetRatio ]
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
            if (box.current) {
                const e = box.current.getBoundingClientRect();
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
        calcSizeBy(e.width, e.height, width, height, targetRatio);
    }, [ calcSizeBy, width, height, targetRatio ]);

    const boxStyle = { ...css } || {};

    if (width) {
        boxStyle.width = typeof width === 'number' ? `${width}px` : width;
    }

    if (targetRatio && box.current) {
        boxStyle.height = box.current.getBoundingClientRect().width / targetRatio;
    }

    if (height) {
        boxStyle.height = `${height}px`;
    }

    return (
        <div
            ref={box}
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