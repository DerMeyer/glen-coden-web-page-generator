import React from 'react';
import { BrowserRouter } from 'react-router-dom';


export default function RouterRRD({ children }) {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
}