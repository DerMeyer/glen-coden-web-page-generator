import React, { useContext, useState } from 'react';
import s from './LoadingOverlay.module.css';
import Store from '../../../store/Store';

import ThreeDotsLoadingIcon from '../../icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';
import Overlay from '../Overlay/Overlay';


export default function LoadingOverlay({ fadeInTime, color, bg, css = {} }) {
    const { state } = useContext(Store);

    const [ visible, setVisible ] = useState(false);

    if (!visible) {
        if (state.loading.length) {
            setVisible(true);
        }
        return null;
    }

    return (
        <Overlay
            color={bg}
            opacity={state.loading.length ? 1 : 0}
            fadeTime={state.loading.length ? 0 : fadeInTime}
            onFadeOut={() => setVisible(false)}
            doClose={state.loading.length === 0}
            initVisible
        >
            {state.loading.length
                ? (
                    <div className={s.iconBox}>
                        <ThreeDotsLoadingIcon
                            size={Math.min(Math.round(state.vw / 15), 80)}
                            color={color}
                        />
                    </div>
                )
                : null
            }
        </Overlay>
    );
}