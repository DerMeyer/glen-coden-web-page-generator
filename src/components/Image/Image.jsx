import React from 'react';
import styles from './Image.module.css';

export default function Image(props) {
    return (
        <div>
            <img
                className={styles.image}
                src={props.source}
                onLoad={() => { console.log('IMAGE COMPONENT LOADED'); }}
                alt=""
            />
        </div>
    );
}