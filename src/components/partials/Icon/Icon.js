import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SocialNetworkIcons } from '../../../js/helpers';

import {ReactComponent as FacebookIcon} from '../../../svg/facebook.svg';
import {ReactComponent as InstagramIcon} from '../../../svg/instagram.svg';
import {ReactComponent as ITunesIcon} from '../../../svg/itunes.svg';
import {ReactComponent as SpotifyIcon} from '../../../svg/spotify.svg';
import {ReactComponent as YoutubeIcon} from '../../../svg/youtube.svg';

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number,
    color: PropTypes.string
};


export default function Icon(props) {
    let SvgComponent;

    switch (props.name) {
        case SocialNetworkIcons.FACEBOOK:
            SvgComponent = <FacebookIcon />;
            break;
        case SocialNetworkIcons.INSTAGRAM:
            SvgComponent = <InstagramIcon />;
            break;
        case SocialNetworkIcons.ITUNES:
            SvgComponent = <ITunesIcon />;
            break;
        case SocialNetworkIcons.SPOTIFY:
            SvgComponent = <SpotifyIcon />;
            break;
        case SocialNetworkIcons.YOUTUBE:
            SvgComponent = <YoutubeIcon />;
            break;
        default:
    }

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