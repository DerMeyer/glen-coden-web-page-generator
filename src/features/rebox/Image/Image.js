import React, { useRef, useState, useEffect } from 'react';
import s from './Image.module.css';
import { imageService } from '../../../index';
import useSize from '../../../app/hooks/useSize';


function Image({ width: w, height: h, src, srcRatio, targetRatio, awaitLoad, priority, className, css = {} }) {
    const boxRef = useRef(null);
    const imageRef = useRef(null);

    const [ id ] = useState(() => imageService.subscribeImage(awaitLoad, priority));
    const [ imageUrl, setImageUrl ] = useState('');
    const [ sizeBy, setSizeBy ] = useState('width');
    const [ visible, setVisible ] = useState(false);

    const [ width, getWidth ] = useSize(w);
    const [ height, getHeight ] = useSize(h);

    useEffect(() => getWidth(w), [ getWidth, w ]);
    useEffect(() => getHeight(h), [ getHeight, h ]);

    useEffect(() => () => imageService.unsubscribeImage(id), [ id ]);

    useEffect(() => {
        setTimeout(() => {
            let rw = width;
            let rh = height;
            if (!width && !height) {
                const boxSize = boxRef.current.getBoundingClientRect();
                rw = boxSize.width;
                rh = targetRatio ? boxSize.width / targetRatio : boxSize.height;
            }
            imageService.getImageUrl({ id, width: rw, height: rh, src, srcRatio })
                .then(url => setImageUrl(url));
        }, 0);
    }, [ id, width, height, src, srcRatio, targetRatio ]);

    useEffect(() => {
        const calcSizeBy = () => {
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
        };
        const timeout = { id: 0 };
        const pollImg = () => {
            if (!imageRef.current || !imageRef.current.complete) {
                timeout.id = setTimeout(() => pollImg(), 40);
                return;
            }
            calcSizeBy();
            setVisible(true);
        };
        pollImg();
        return () => clearTimeout(timeout.id);
    }, [ width, height, targetRatio ]);

    const style = { ...css, opacity: visible ? 1 : 0 };

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