import { useState, useCallback, useEffect } from 'react';

const sizeMap = {
    images: [ 100, 300, 500, 750, 1000, 1500, 2500 ],
    icons: [ 32, 64, 128, 256, 512, 1024 ]
};

function findCustomSize(type, width, height) {
    if (type === 'images' && (width < 600) && (width / height < 0.8)) {
        return 'mobile-portrait';
    }
    return undefined;
}


export default function useOptimalSource() {
    const [ originalSrc, setOriginalSrc ] = useState('');
    const [ requestedSrc, setRequestedSrc ] = useState('');
    const [ optimalSrc, setOptimalSrc ] = useState('');
    const [ maxRequestedWidth, setMaxRequestedWidth ] = useState(0);
    const [ errors, setErrors ] = useState([]);

    const requestOptimalSource = useCallback(
        (src, width, height) => {
            setOriginalSrc(src);
            if (!width) {
                setOptimalSrc(src);
                return;
            }
            if (width <= maxRequestedWidth) {
                return;
            }
            const segments = src.split('/');
            const name = segments.pop();
            const type = segments.pop();
            const sizes = sizeMap[type];
            if (!sizes) {
                setRequestedSrc(src);
                return;
            }
            const customSize = findCustomSize(type, width, height);
            if (customSize) {
                setRequestedSrc(`${type}/${customSize}/${name}`);
                return;
            }
            const size = sizes.find(s => s >= width) || sizes.pop();
            setMaxRequestedWidth(size);
            setRequestedSrc(`${type}/${size}px/${name}`);
        },
        [ maxRequestedWidth ]
    );

    useEffect(() => {
        if (!requestedSrc || errors.includes(requestedSrc)) {
            return;
        }
        const img = new window.Image();
        img.onload = () => {
            setOptimalSrc(requestedSrc);
        };
        img.onerror = () => {
            setOptimalSrc(originalSrc);
            setErrors(prevErrors => {
                if (prevErrors.includes(requestedSrc)) {
                    return [ ...prevErrors ];
                }
                console.warn(`Missing an optimized image for ${requestedSrc}`);
                return [ ...prevErrors, requestedSrc ];
            });
        };
        img.src = requestedSrc;
    }, [ originalSrc, requestedSrc, errors ]);

    return [ optimalSrc, requestOptimalSource ];
}