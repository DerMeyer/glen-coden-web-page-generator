import React, { useEffect } from 'react';
import s from './Form.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import { requestService } from '../../../index';


export default function Form(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);

    useEffect(() => {
        getBoxStyle(props);
    });

    return (
        <form
            className={s.form}
            style={boxStyle}
        >
            {React.Children.toArray(props.children).map(child => React.cloneElement(child, { color: 'lime' }))}
            <div
                onClick={() => {
                    requestService.post(`${requestService.apiRoute}/contact`, {
                        from: 'admin@glencoden.de',
                        to: 'hainarbeit@gmail.com',
                        subject: 'Test Mail',
                        text: 'Hi from Glen Coden FE'
                    })
                        .then(res => console.log(res));
                }}
            >
                MAIL TO HAINARBEIT
            </div>
            <div
                onClick={() => {
                    requestService.post(`${requestService.apiRoute}/contact`, {
                        from: 'admin@glencoden.de',
                        to: 'simon.der.meyer@gmail.com',
                        subject: 'Test Mail',
                        text: 'Hi from Glen Coden FE'
                    })
                        .then(res => console.log(res));
                }}
            >
                MAIL TO GLEN CODEN
            </div>
        </form>
    );
}