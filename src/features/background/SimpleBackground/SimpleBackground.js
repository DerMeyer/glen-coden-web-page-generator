import React from 'react';
import s from './SimpleBackground.module.css';
import { useSelector } from 'react-redux';
import { selectSize } from '../../../app/appSlice';

import Image from '../../rebox/Image/Image';


export default function SimpleBackground({ image }) {
    const { vw, vh } = useSelector(selectSize);
    return (
        <div className={s.SimpleBackground}>
            <Image
                source={image}
                width={vw}
                height={vh}
                subscribeToGlobalLoading
            />
        </div>
    );
}