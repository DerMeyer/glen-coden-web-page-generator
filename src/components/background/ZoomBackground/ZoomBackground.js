import React, { useContext } from 'react';
import s from './ZoomBackground.module.css';
import Store from '../../../store/Store';

import ZoomBox from '../../container/ZoomBox/ZoomBox';
import Image from '../../rebox/Image/Image';


export default function ZoomBackground({ auto, factor, time, image }) {
    const { state } = useContext(Store);
    return (
        <div className={s.ZoomBackground}>
            <ZoomBox
                auto={auto}
                factor={factor}
                time={time}
            >
                <Image
                    source={image}
                    width={state.vw}
                    height={state.vh}
                    subscribeToGlobalLoading
                />
            </ZoomBox>
        </div>
    );
}