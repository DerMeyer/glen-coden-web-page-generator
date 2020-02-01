import React, { useRef, useState, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};


export default function Image(props) {
    const image = useRef(null);

    const [style, setStyle] = useState({});

    const resize = () => {
        const targetDelta = props.width / props.height;
        const imageDelta = image.current.offsetWidth / image.current.offsetHeight;
        setStyle(targetDelta > imageDelta ? { width: '100%' } : { height: '100%' });
    };

    useEffect(() => {
        resize();
    }, [props.width, props.height]);

    const onLoad = () => {
        console.log('IMAGE COMPONENT LOADED');
        resize();
    };

    return (
        <div
            className={cx(styles.imageBox, { [props.className]: props.className })}
            style={{
                width: props.width,
                height: props.height,
                ...props.style
            }}
        >
            <img
                ref={image}
                style={style}
                src={props.source}
                onLoad={onLoad}
                alt=""
            />
        </div>
    );
}