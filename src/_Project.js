import React from 'react';

import ZoomBackground from './components/background/ZoomBackground/ZoomBackground';
import Headline from './components/text/Headline/Headline';
import LoadingOverlay from './components/overlay/LoadingOverlay/LoadingOverlay';


export default function _Project() {
	return (
		<>
			<ZoomBackground level={[]}>
				<Headline level={['ZoomBackground']} />
			</ZoomBackground>
			<LoadingOverlay level={[]} />
		</>
	);
}
