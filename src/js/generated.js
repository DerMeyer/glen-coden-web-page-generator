exports.icons = {
	sources: [
		'.jpg',
		'.jpeg',
		'.png'
	],
	sourcePath: [
		'static',
		'icons'
	],
	targetPath: [
		'static',
		'icons',
		'optimized'
	],
	optionList: [
		{
			method: 'scale',
			width: 32
		},
		{
			method: 'scale',
			width: 64
		},
		{
			method: 'scale',
			width: 128
		},
		{
			method: 'scale',
			width: 256
		},
		{
			method: 'scale',
			width: 512
		},
		{
			method: 'scale',
			width: 1024
		}
	]
};

exports.images = {
	sources: [
		'.jpg',
		'.jpeg',
		'.png'
	],
	sourcePath: [
		'static',
		'images'
	],
	targetPath: [
		'static',
		'images',
		'optimized'
	],
	optionList: [
		{
			method: 'scale',
			width: 100
		},
		{
			method: 'scale',
			width: 300
		},
		{
			method: 'scale',
			width: 500
		},
		{
			method: 'scale',
			width: 750
		},
		{
			method: 'scale',
			width: 1000
		},
		{
			method: 'scale',
			width: 1500
		},
		{
			method: 'scale',
			width: 2500
		},
		{
			method: 'cover',
			width: 450,
			height: 800
		}
	]
};
