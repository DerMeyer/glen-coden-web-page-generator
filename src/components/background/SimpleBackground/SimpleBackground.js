import React, { useContext } from 'react';
import s from './SimpleBackground.module.css';
import Store from '../../../store/Store';

import Image from '../../rebox/Image/Image';


export default function SimpleBackground({ image }) {
    const { state } = useContext(Store);
    return (
        <div className={s.SimpleBackground}>
            <Image
                source={image}
                width={state.vw}
                height={state.vh}
                subscribeToGlobalLoading
            />
        </div>
    );
}