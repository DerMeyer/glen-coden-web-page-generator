import React, { useState } from 'react';
import { Route } from 'react-router-dom';


export default function RouteRRD({ path, children }) {
    const [ prevPathname, setPrevPathname ] = useState(window.location.pathname);

    if (window.location.pathname !== prevPathname) {
        window.scroll(0, 0);
        setPrevPathname(window.location.pathname);
    }

    return (
        <Route
            exact={path === '/'}
            path={path}
        >
            {children}
        </Route>
    );
}