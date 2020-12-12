const sizes = {
    images: [ 100, 300, 500, 750, 1000, 1500, 2500 ],
    icons: [ 32, 64, 128, 256, 512, 1024 ]
};

function findCustomSize(type, width, height) {
    if (type === 'images' && (width < 600) && (width / height < 0.8)) {
        return 'mobile-portrait';
    }
    return undefined;
}

export function getOptimalSrc(width, height, src, ratio = 1.5) {
    if (width / height < ratio) {
        width = ratio * height;
    }
    const [ name, type ] = src.split('/').reverse();
    if (!sizes[type]) {
        console.warn('wrong image type');
        return;
    }
    let size = findCustomSize(type, width, height);
    if (!size) {
        size = sizes[type].find((s, i, a) => s >= width || i === a.length - 1);
    }
    const url = `${type}/${typeof size === 'number' ? size + 'px' : size}/${name}`;
    return { name, type, size, url };
}
