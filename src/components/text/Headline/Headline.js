import React, { useState } from 'react';
import { configService } from '../../../index';


export default function Headline(props) {
    const [config] = useState(() => configService.getComponentConfig(props.id));
    return (
        <div style={{
            position: 'fixed',
            left: '6%',
            bottom: '55px',
            fontFamily: 'Comfortaa',
            fontSize: '55px',
            fontWeight: 'bold',
            color: 'white',
            whiteSpace: 'nowrap'
        }}>
            The Eternal Love
        </div>
    );
}