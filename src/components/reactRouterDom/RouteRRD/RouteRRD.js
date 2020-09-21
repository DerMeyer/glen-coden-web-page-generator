import React from 'react';
import { Route } from 'react-router-dom';


export default function RouteRRD({ path, children }) {
    return path === '/' ? (
        <Route exact path={path}>
            {children}
        </Route>
    ) : (
        <Route path={path}>
            {children}
        </Route>
    );
}