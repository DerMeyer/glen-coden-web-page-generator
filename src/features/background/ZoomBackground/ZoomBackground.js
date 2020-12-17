import React from 'react';
import s from './ZoomBackground.module.css';
import { useSelector } from 'react-redux';
import { selectSize } from '../../../app/appSlice';

import ZoomBox from '../../container/ZoomBox/ZoomBox';
import Image from '../../rebox/Image/Image';


export default function ZoomBackground({ auto, factor, time, image }) {
    const { vw, vh } = useSelector(selectSize);
    return (
        <div className={s.ZoomBackground}>
            <ZoomBox
                auto={auto}
                factor={factor}
                time={time}
            >
                <Image
                    src={image}
                    width={vw}
                    height={vh}
                    awaitLoad
                />
            </ZoomBox>
        </div>
    );
}