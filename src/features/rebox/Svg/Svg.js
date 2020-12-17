import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import * as SvgList from '../../../app/svgExports';


export default function Svg({ name, width, height, color, css, className }) {
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!SvgList[name]) {
        return <div>unknown svg name</div>;
    }

    const SvgComponent = React.createElement(SvgList[name]);

    const style = {
        width: `${width}px`,
        height: `${height || width}px`,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.1s'
    };

    if (color) {
        style.fill = color;
    }

    return (
        <div
            className={cx('', { [className]: className })}
            style={{
                ...style,
                ...css
            }}
        >
            {SvgComponent}
        </div>
    );
}