import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './StickyBar.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes } from '../../../js/helpers';


export default function StickyBar(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const pollScroll = useCallback(
        event => {
            console.log('POLL SCROLL IS BEING CALLED', event);// TODO remove dev code
        },
        []
    );

    useEffect(() => {
        window.addEventListener('scroll', (event) => {
            console.log('scroll');
            pollScroll(event);
        });
        return () => {
            window.removeEventListener('scroll', pollScroll);
        };
    }, [pollScroll]);

    const contentWidth = globalState.deviceType === DeviceTypes.MOBILE ? config.style.pageContentSize.widthMobile : config.style.pageContentSize.width;
    const contentHeight = globalState.deviceType === DeviceTypes.MOBILE ? config.style.pageContentSize.heightMobile : config.style.pageContentSize.height;

    const style = {
        top: `${(100 - contentHeight) / 2}%`,
        width: `${contentWidth}%`,
        justifyContent: config.justifyContent,
        alignItems: config.alignItems
    };

    return (
        <div
            className={styles.stickyBar}
            style={{
                ...style,
                ...config.css
            }}
        >
            {props.children}
        </div>
    );
}