import React, { useRef, useState, useEffect } from 'react';
import s from './Image.module.css';
import useSize from '../../../hooks/useSize';
import { imageService } from '../../../index';


function Image({ width: w, height: h, src, srcRatio, targetRatio, awaitLoad, priority, className, css }) {
    const boxRef = useRef(null);
    const imageRef = useRef(null);

    const [ width, getWidth ] = useSize(w);
    const [ height, getHeight ] = useSize(h);

    const [ id ] = useState(() => imageService.subscribeImage(awaitLoad, priority));
    const [ imageUrl, setImageUrl ] = useState('');
    const [ sizeBy, setSizeBy ] = useState('width');
    const [ pollCount, setPollCount ] = useState(0);

    useEffect(() => getWidth(w), [ getWidth, w ]);
    useEffect(() => getHeight(h), [ getHeight, h ]);

    useEffect(() => () => imageService.unsubscribeImage(id), [ id ]);

    useEffect(() => {
        setTimeout(() => {
            let reqWidth = width;
            let reqHeight = height;
            if (!width && !height) {
                const boxSize = boxRef.current.getBoundingClientRect();
                reqWidth = boxSize.width;
                reqHeight = targetRatio ? boxSize.width / targetRatio : boxSize.height;
            }
            imageService.getImageUrl({ id, width: reqWidth, height: reqHeight, src, srcRatio })
                .then(url => {
                    console.log('IMAGE URL: ', id, url);// TODO remove dev code
                    setImageUrl(url);
                });
        }, 0);
    }, [ id, width, height, src, srcRatio, targetRatio ]);

    useEffect(() => {
        if (pollCount > 50) {
            return;
        }
        let timeoutId = 0;
        if (!imageRef.current) {
            timeoutId = setTimeout(() => setPollCount(prev => prev + 1), 20);
            return () => clearTimeout(timeoutId);
        }
        setTimeout(() => {
            const img = imageRef.current.getBoundingClientRect();
            setSizeBy(() => {
                if (!height) {
                    return targetRatio < img.width / img.height ? 'height' : 'width';
                }
                if (!width) {
                    return targetRatio > img.width / img.height ? 'width' : 'height';
                }
                return (img.width / img.height) / (width / height) < 1 ? 'width' : 'height';
            });
        }, 0);
    }, [ width, height, targetRatio, pollCount ]);

    const style = { ...css } || {};

    if (width) {
        style.width = width + 'px';
    }
    if (typeof w === 'string' && w.endsWith('%')) {
        style.width = w;
    }
    if (targetRatio && boxRef.current) {
        style.height = boxRef.current.getBoundingClientRect().width / targetRatio + 'px';
    }
    if (height) {
        style.height = height + 'px';
    }

    console.log('IMAGE RUNS');// TODO remove dev code

    return (
        <div
            ref={boxRef}
            id={id}
            className={`${s.ImageBox}${className ? ` ${className}` : ''}`}
            style={style}
        >
            {imageUrl && (
                <img
                    ref={imageRef}
                    className={s.Image}
                    style={{ [sizeBy]: '100%' }}
                    src={imageUrl}
                    alt={imageUrl}
                />
            )}
        </div>
    );
}

export default Image;