const TargetImageRatios = {
    DEFAULT: 'default',
    PORTRAIT: 'portrait'
};

const targetImageSizes = [
    { ratio: TargetImageRatios.DEFAULT, width: 100 },
    { ratio: TargetImageRatios.DEFAULT, width: 300 },
    { ratio: TargetImageRatios.DEFAULT, width: 500 },
    { ratio: TargetImageRatios.DEFAULT, width: 750 },
    { ratio: TargetImageRatios.DEFAULT, width: 1000 },
    { ratio: TargetImageRatios.DEFAULT, width: 1500 },
    { ratio: TargetImageRatios.DEFAULT, width: 2500 },
    { ratio: TargetImageRatios.PORTRAIT, width: 450, height: 800 }
];

exports.TargetImageRatios = TargetImageRatios;
exports.targetImageSizes = targetImageSizes;