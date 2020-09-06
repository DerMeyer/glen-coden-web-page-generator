import React, { useContext, useState } from 'react';
import s from './LoadingOverlay.module.css';
import Store from '../../../store/Store';

import ThreeDotsLoadingIcon from '../../partial/icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';

LoadingOverlay.defaultProps = {
    global: {
        fadeInTime: 0.2,
        colors: {}
    },
    css: {}
};


export default function LoadingOverlay({ fadeInTime, overlayColor, iconColor, css }) {
    console.log(fadeInTime, overlayColor, iconColor);// TODO remove dev code
    const { state } = useContext(Store);

    const [ visible, setVisible ] = useState(true);

    if (!visible) {
        if (state.loading.length) {
            setVisible(true);
        }
        return null;
    }

    return (
        <div
            className={s.overlay}
            style={{
                backgroundColor: overlayColor,
                opacity: state.loading.length ? '1' : '0',
                transition: `opacity ${state.loading.length ? 0 : fadeInTime}s`,
                ...css
            }}
            onTransitionEnd={() => setVisible(false)}
        >
            {state.loading.length
                ? (
                    <ThreeDotsLoadingIcon
                        size={Math.round(state.viewportWidth / 15)}
                        color={iconColor}
                    />
                )
                : null
            }
        </div>
    );
}