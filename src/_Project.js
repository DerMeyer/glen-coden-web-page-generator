import React from 'react';

import ZoomBackground from './components/background/ZoomBackground/ZoomBackground';
import LoadingOverlay from './components/overlay/LoadingOverlay/LoadingOverlay';
import Headline from './components/text/Headline/Headline';


export default function _Project() {
    return (
        <>
            <ZoomBackground chain={[]}>
                <Headline />
            </ZoomBackground>
            <LoadingOverlay chain={[]} />
        </>
    );
}