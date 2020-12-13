const sizes = {
    images: [ 100, 300, 500, 750, 1000, 1500, 2500 ],
    icons: [ 32, 64, 128, 256, 512, 1024 ]
};

export function getOptimalSrc(width, height, src, ratio = 1.5) {
    if (width / height < ratio) {
        width = ratio * height;
    }
    const [ name, dir ] = src.split('/').reverse();
    if (!sizes[dir]) {
        console.warn('unknown image directory');
        return { name, dir, size: 'unknown', url: src };
    }
    const size = sizes[dir].find((s, i, a) => s >= width || i === a.length - 1);
    const url = `${dir}/${size}px/${name}`;
    return { name, dir, size, url };
}
