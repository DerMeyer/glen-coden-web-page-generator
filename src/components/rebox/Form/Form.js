import React, { useState, useEffect, useCallback } from 'react';
import s from './Form.module.css';
import useBoxStyle from '../../../hooks/useBoxStyle';
import { requestService } from '../../../index';
import { isEmail } from '../../../js/helpers';

const contactForm = {
    name: 'Name',
    from: 'Email',
    subject: 'Subject',
    text: 'Message'
};


export default function Form(props) {
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ formData, setFormData ] = useState({ ...contactForm });
    const [ inputStyles, setInputStyles ] = useState(() => {
        const initState = {};
        Object.keys(contactForm).map(k => initState[k] = {});
        return initState;
    });

    const onChange = useCallback(
        event => {
            setFormData(prevState => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    const onFocus = useCallback(
        event => {
            setFormData(prevState => ({
                ...prevState,
                [event.target.name]: ''
            }));
        },
        []
    );

    const onBlur = useCallback(
        event => {
            if (event.target.value) {
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                [event.target.name]: contactForm[event.target.name]
            }));
        },
        []
    );

    useEffect(() => {
        getBoxStyle(props);
    });

    return (
        <form
            className={s.form}
            style={boxStyle}
        >
            {React.Children.toArray(props.children).map(child => React.cloneElement(child, { formData, onChange, onFocus, onBlur, inputStyles }))}
            <div
                onClick={() => {
                    let err = false;
                    Object.keys(formData).forEach(k => {
                        const v = formData[k];
                        if (!v || v === contactForm[k] || (k === 'from' && !isEmail(v))) {
                            err = true;
                            setInputStyles(prevState => ({
                                ...prevState,
                                [k]: { border: '1px solid #FF4040', backgroundColor: '#FFEBEC' }
                            }));
                        }
                    });
                    if (err) {
                        console.log('UPS, MISSING INPUT');// TODO remove dev code
                        return;
                    }
                    requestService.post(`${requestService.apiRoute}/contact`, {
                        from: formData.from,
                        subject: formData.subject,
                        text: `Hey Fabi, hier ist eine Email von ${formData.name}.\n\n${formData.text}`,
                        to: 'simon.der.meyer@gmail.com'
                    })
                        .then(res => console.log(res));
                }}
            >
                SEND
            </div>
        </form>
    );
}