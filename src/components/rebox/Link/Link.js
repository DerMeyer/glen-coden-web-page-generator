import React from 'react';
import s from './Link.module.css';
import cx from 'classnames';


export default function Link({ url, className, children }) {
    if (!url) {
        return (
            <div className={cx(s.link, { [className]: className })}>
                {children}
            </div>
        );
    }

    return (
        <a
            className={cx(s.link, { [className]: className })}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
}