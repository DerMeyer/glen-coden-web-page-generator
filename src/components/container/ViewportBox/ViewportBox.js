import React, { useContext } from 'react';
import Store from '../../../store/Store';

ViewportBox.defaultProps = {
    width: 100,
    height: 100
};


export default function ViewportBox({ width, height, center, children }) {
    const { state } = useContext(Store);
    return (
        <div
            style={{
                width: `${width / 100 * state.vw}px`,
                height: `${height / 100 * state.vh}px`,
                ...(center
                        ? {
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }
                        : {}
                )
            }}
        >
            {children}
        </div>
    );
}