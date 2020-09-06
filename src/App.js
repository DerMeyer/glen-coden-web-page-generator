import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const { getProps, setBreakpointType } = configService;
    const globProps = getProps();

    console.log('APP RUNS');// TODO remove dev code

    useEffect(() => setBreakpointType(state.breakPointType), [ setBreakpointType, state.breakPointType ]);

    useEffect(() => {
        document.body.style.fontSize = `${globProps.fontSizes.body}px`;
        document.body.style.backgroundColor = globProps.colors[globProps.bgColor];

        window.setTimeout(() => dispatch(actions.showApp()), globProps.fadeInTime * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), globProps.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, globProps ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${globProps.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
