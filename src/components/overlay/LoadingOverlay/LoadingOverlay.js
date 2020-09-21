import React, { useContext, useState } from 'react';
import s from './LoadingOverlay.module.css';
import Store from '../../../store/Store';

import ThreeDotsLoadingIcon from '../../icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


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
        <div
            className={s.overlay}
            style={{
                backgroundColor: bg,
                opacity: state.loading.length ? '1' : '0',
                transition: `opacity ${state.loading.length ? 0 : fadeInTime}s`,
                ...css
            }}
            onTransitionEnd={() => setVisible(false)}
        >
            {state.loading.length
                ? (
                    <ThreeDotsLoadingIcon
                        size={Math.round(state.vw / 15)}
                        color={color}
                    />
                )
                : null
            }
        </div>
    );
}