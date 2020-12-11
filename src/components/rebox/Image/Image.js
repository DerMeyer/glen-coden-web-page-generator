import React, { useRef, useState, useCallback, useEffect } from 'react';
import s from './Image.module.css';
import { imageService } from '../../../index';
import useSize from '../../../hooks/useSize';


// width, height, src, srcRatio, targetRatio, awaitLoad, priority, css

// useSize

// subscribe
// update
// each case returns Promise that resolves to a source
// >> useImageService or usePromise?


export default function Image({ width: w, height: h, src, srcRatio, targetRatio, awaitLoad, priority, className, css }) {
    console.log('IMAGE RUNS');// TODO remove dev code

    const [ width, getWidth ] = useSize(w);
    const [ height, getHeight ] = useSize(h);

    const box = useRef(null);
    const image = useRef(null);

    const [ id ] = useState(() => imageService.subscribeImage({ width, height, src, srcRatio, awaitLoad, priority }));
    const [ imageUrl, setImageUrl ] = useState('');
    const [ sizeBy, setSizeBy ] = useState('width');

    useEffect(() => getWidth(w), [ getWidth, w ]);
    useEffect(() => getHeight(h), [ getHeight, h ]);

    useEffect(() => () => imageService.unsubscribeImage(id), [ id ]);

    useEffect(() => {
        imageService.getImageUrl(id, { width, height, src, srcRatio, awaitLoad, priority })
            .then(url => setImageUrl(url));
    }, [ id, width, height, src, srcRatio, awaitLoad, priority ]);


    // WAIT FOR REF SIZE IF NO INPUT SIZE


    const calcSizeBy = useCallback(
        (imgWidth, imgHeight, targetWidth, targetHeight, targetRatio) => {
            if (!targetHeight) {
                setSizeBy(targetRatio < imgWidth / imgHeight ? 'height' : 'width');
                return;
            }
            if (!targetWidth) {
                setSizeBy(targetRatio > imgWidth / imgHeight ? 'width' : 'height');
                return;
            }
            setSizeBy((imgWidth / imgHeight) / (targetWidth / targetHeight) < 1 ? 'width' : 'height');
        },
        []
    );

    useEffect(() => {
        setTimeout(() => {
            if (!image.current) {
                return;
            }
            const imgSize = image.current.getBoundingClientRect();
            calcSizeBy(imgSize.width, imgSize.height, width, height, targetRatio);
        }, 0);
    }, [ calcSizeBy, width, height, targetRatio ]);

    const style = { ...css } || {};

    if (width) {
        style.width = width + 'px';
    }

    if (targetRatio && box.current) {
        style.height = box.current.getBoundingClientRect().width / targetRatio + 'px';
    }

    if (height) {
        style.height = height + 'px';
    }

    return (
        <div
            ref={box}
            className={`${s.ImageBox}${className ? ` ${className}` : ''}`}
            style={style}
        >
            {imageUrl && (
                <img
                    ref={image}
                    className={s.Image}
                    style={{ [sizeBy]: '100%' }}
                    src={imageUrl}
                    alt={imageUrl}
                />
            )}
        </div>
    );
}