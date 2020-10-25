import React, { useContext, useState } from 'react';
import s from './LoadingOverlay.module.css';
import Store from '../../../store/Store';
import cx from 'classnames';

import ThreeDotsLoadingIcon from '../../icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';
import Overlay from '../Overlay/Overlay';


export default function LoadingOverlay({ fadeInTime, color, bg }) {
    const { state } = useContext(Store);

    const [ visible, setVisible ] = useState(false);
    const [ iconFadedIn, setIconFadedIn ] = useState(false);

    if (!visible) {
        if (state.loading.length) {
            setVisible(true);
        }
        if (iconFadedIn) {
            setIconFadedIn(false);
        }
        return null;
    }

    return (
        <Overlay
            color={bg}
            fadeTime={state.loading.length ? 0 : fadeInTime}
            onFadeOut={() => setVisible(false)}
            doClose={state.loading.length === 0}
            initVisible
        >
            {state.loading.length
                ? (
                    <div
                        className={cx(s.iconBox, { [s.fadedIn]: iconFadedIn })}
                        onAnimationEnd={() => setIconFadedIn(true)}
                    >
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