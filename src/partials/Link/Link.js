import React from 'react';
import styles from './Link.module.css';
import PropTypes from 'prop-types';
import cx from 'classnames';

Link.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string.isRequired,
    internal: PropTypes.bool.isRequired
};


export default function Link(props) {
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