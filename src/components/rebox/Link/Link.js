import React from 'react';
import styles from './Link.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';

Link.propTypes = {
    className: PropTypes.string,
    internal: PropTypes.bool
};


export default function Link(props) {
    if (!props.url) {
        return (
            <div className={cx(styles.link, { [props.className]: props.className })}>
                {props.children}
            </div>
        );
    }

    if (props.internal) {
        return <div>Internal Links are WIP</div>;
    }

    return (
        <a
            className={cx(styles.link, { [props.className]: props.className })}
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {props.children}
        </a>
    );
}