import React, { useState, useEffect } from 'react';
import s from './LoadingSign.module.css';

import ThreeDotsLoadingIcon from '../../icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


function LoadingSign({ parentVisible, delay = 1, Icon = ThreeDotsLoadingIcon }) {
    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        if (parentVisible) {
            setVisible(false);
            return;
        }
        const timeoutId = setTimeout(() => {
            setVisible(true);
        }, delay * 1000);
        return () => clearTimeout(timeoutId);
    }, [ parentVisible, delay ]);

    if (!visible) {
        return null;
    }

    return (
        <div
            className={s.LoadingSign}
            style={{}}
        >
            <Icon color={'black'} size={50} />
        </div>
    );
}

export default LoadingSign;