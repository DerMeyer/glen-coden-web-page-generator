import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './NavigationBar.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { InstagramSvg } from '../../../js/svgExports';


export default function NavigationBar(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const [calcWidth, setCalcWidth] = useState(0);

    const navBarRef = useRef(null);

    useEffect(() => {
        const widthByContent = navBarRef.current.offsetWidth;
        setCalcWidth(widthByContent * 1.5 * config.stretchFactor);
    }, [globalState.viewportWidth, config.stretchFactor]);

    const style = {
        justifyContent: config.justifyContent,
        alignItems: config.alignItems,
        color: config.style[config.color]
    };

    if (calcWidth) {
        style.width = `${calcWidth}px`;
    }

    return (
        <div
            ref={navBarRef}
            className={styles.navigationBar}
            style={style}
        >
            <InstagramSvg style={{ width: '40px', height: '40px' }} />
            <InstagramSvg style={{ width: '40px', height: '40px' }} />
            <InstagramSvg style={{ width: '40px', height: '40px' }} />
        </div>
    );
}