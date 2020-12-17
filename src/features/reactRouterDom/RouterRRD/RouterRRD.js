import React from 'react';
import { BrowserRouter } from 'react-router-dom';


export default function RouterRRD({ children }) {

    // This way the router works on github pages, eg dermeyer.github.io/my-project/
    const { projectName } = window.projectInfo;
    let basename = '/';
    if (window.location.pathname.startsWith(`/${projectName}`)) {
        basename = `/${projectName}-dev`;
    }
    //

    return (
        <BrowserRouter basename={basename}>
            {children}
        </BrowserRouter>
    );
}