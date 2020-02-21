import React from 'react';

import ZoomBackground from './components/background/ZoomBackground/ZoomBackground';
import LoadingOverlay from './components/overlay/LoadingOverlay/LoadingOverlay';
import Headline from './components/text/Headline/Headline';


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