import React, { useContext, useState } from 'react';
import styles from './Page.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function Page(props) {
    const { state } = useContext(Store);
    const [ config ] = useState(() => configService.getComponentConfig(props.id));

    const contentWidth = state.contentWidth / 100 * state.viewportWidth;
    const contentHeight = state.contentHeight / 100 * state.viewportHeight;

    const style = {
        gridTemplateRows: `repeat(${config.rows}, minmax(${contentHeight / config.rows}px, auto))`,
        left: `${Math.max((state.viewportWidth - config.style.maxPageWidth), 0) / 2}px`,
        width: `${Math.min(state.viewportWidth, config.style.maxPageWidth)}px`,
        minHeight: `${config.minHeight || state.viewportHeight}px`,
        padding: `${(state.viewportHeight - contentHeight) / 2}px ${(state.viewportWidth - contentWidth) / 2}px`,
    };

    return (
        <div
            className={styles.page}
            style={{
                ...style,
                ...(config.css || {})
            }}
        >
            {props.children}
        </div>
    );
}