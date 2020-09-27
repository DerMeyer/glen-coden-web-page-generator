import React from 'react';
import cx from 'classnames';

import * as SvgList from '../../../js/svgExports';


export default function Svg({ name, width, height, color, className }) {
    if (!SvgList[name]) {
        return <div>unknown svg name</div>;
    }

    const SvgComponent = React.createElement(SvgList[name]);

    const style = {
        width: `${width}px`,
        height: `${height || width}px`
    };

    if (color) {
        style.fill = color;
    }

    return (
        <div
            className={cx('', { [className]: className })}
            style={style}
        >
            {SvgComponent}
        </div>
    );
}