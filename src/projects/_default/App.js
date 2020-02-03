import React from 'react';
import styles from './App.module.css';


export default function App({ missingProject }) {
    return (
        <div className={styles.app}>
            Glen Coden Web Page Generator couldn't find the project "{missingProject}".
        </div>
    );
}
