import React, { useContext, useRef, useState, useEffect } from 'react';
import styles from './Image.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Store, { actions } from '../../../Store';

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};


export default function Image(props) {
    const { dispatch } = useContext(Store);
    const image = useRef(null);
    const [imageStyle, setImageStyle] = useState({ opacity: '0' });

    const resize = () => {
        const targetDelta = props.width / props.height;
        const imageDelta = image.current.offsetWidth / image.current.offsetHeight;
        setImageStyle(prevState =>  {
            const sizeByWidth = targetDelta > imageDelta;
            return {
                ...prevState,
                width: sizeByWidth ? '100%' : 'auto',
                height: sizeByWidth ? 'auto' : '100%'
            };
        });
    };

    useEffect(() => {
        dispatch(actions.startLoading());
    }, []);

    useEffect(() => {
        resize();
    }, [props.width, props.height]);

    const onLoad = () => {
        window.setTimeout(() => {
            resize();
            setImageStyle(prevState => ({
                ...prevState,
                opacity: '1'
            }));
            dispatch(actions.stopLoading());
        }, 4000); // TODO remove dev code
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
                className={styles.image}
                style={imageStyle}
                src={props.source}
                onLoad={onLoad}
                alt=""
            />
        </div>
    );
}