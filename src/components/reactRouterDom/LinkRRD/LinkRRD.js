import React from 'react';
import { Link } from 'react-router-dom';


export default function LinkRRD({ to, children }) {
    return (
        <Link to={to}>
            {children}
        </Link>
    );
}