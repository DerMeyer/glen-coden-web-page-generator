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
    const [ requested, setRequested ] = useState('');
    const [ optimal, setOptimal ] = useState('');
    const [ source, setSource ] = useState('');
    const [ maxRequestedWidth, setMaxRequestedWidth ] = useState(0);

    const requestOptimalSrc = useCallback(
        (src, width, height, ratio = 1.5) => {
            if (!src) {
                return;
            }
            setRequested(src);
            if (!width) {
                setSource(src);
                return;
            }
            if (width && height) {
                if (width / height < ratio) {
                    width = ratio * height;
                }
            }
            if (width <= maxRequestedWidth) {
                return;
            }
            const segments = src.split('/');
            const name = segments.pop();
            const type = segments.pop();
            const sizes = sizeMap[type];
            if (!sizes) {
                setOptimal(src);
                return;
            }
            //////// CUSTOM SIZE INTEGRATION ///////
            const customSize = findCustomSize(type, width, height);
            if (customSize) {
                setOptimal(`${type}/${customSize}/${name}`);
                return;
            }
            ////////////////////////////////////////
            const size = sizes.find(s => s >= width) || sizes.pop();
            setMaxRequestedWidth(size);
            setOptimal(`${type}/${size}px/${name}`);
        },
        [ maxRequestedWidth ]
    );

    useEffect(() => {
        if (!optimal) {
            return;
        }
        const img = new window.Image();
        img.onload = () => {
            setSource(optimal);
        };
        img.onerror = () => {
            console.warn(`Missing an optimized image for ${optimal}`);
            setSource(requested);
        };
        img.src = optimal;
    }, [ requested, optimal ]);

    return [ source, requestOptimalSrc ];
}