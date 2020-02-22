import React from 'react';

import ZoomBackground from './components/background/ZoomBackground/ZoomBackground';
import Headline from './components/text/Headline/Headline';
import LoadingOverlay from './components/overlay/LoadingOverlay/LoadingOverlay';


export default function _Project() {
	return (
		<>
			<ZoomBackground id="ZoomBackground_1">
				<Headline id="Headline_1" />
				<Headline id="Headline_2" />
			</ZoomBackground>
			<LoadingOverlay id="LoadingOverlay_1" />
		</>
	);
}
