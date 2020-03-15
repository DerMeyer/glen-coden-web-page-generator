import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as SvgList from '../../js/svgExports';

Svg.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number,
    color: PropTypes.string
};


export default function Svg(props) {
    if (!SvgList[props.name]) {
        return <div>unknown svg name</div>;
    }

    const SvgComponent = React.createElement(SvgList[props.name]);

    const width = `${props.width}px`;
    const height = `${props.height || props.width}px`;
    const style = { width, height };

    if (props.color) {
        style.fill = props.color;
    }

    return (
        <div
            className={cx('', { [props.className]: props.className })}
            style={style}
        >
            {SvgComponent}
        </div>
    );
}