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
                    requestService.get(`${requestService.apiRoute}/config/hainarbeit`);
                }}
            >
                GET CONFIG
            </div>
            <div
                onClick={() => {
                    requestService.get(`${requestService.apiRoute}/contact`);
                }}
            >
                TEST ROUTE
            </div>
            <div
                onClick={() => {
                    requestService.post(`${requestService.apiRoute}/contact`, {
                        from: 'admin@glencoden.de',
                        to: 'simon.der.meyer@gmail.com',
                        subject: 'Test Mail',
                        text: 'First Form from Glen Coden FE'
                    })
                        .then(res => console.log(res));
                }}
            >
                MAIL TIME
            </div>
        </form>
    );
}