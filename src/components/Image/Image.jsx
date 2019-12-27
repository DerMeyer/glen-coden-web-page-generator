import React from 'react';
import './Image.css';

export default function Image(props) {
    return (
        <div>
            <img
                className="image-component"
                src={props.source}
            />
        </div>
    );
}