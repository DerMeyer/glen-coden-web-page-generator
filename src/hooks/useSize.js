import { useContext, useState } from 'react';
import Store from '../store/Store';

function calcSize(val, vw, vh) {
    if (typeof val === 'string') {
        if (val.endsWith('vw')) {
            return Math.round(Number(val.slice(0, -2)) / 100 * vw);
        }
        if (val.endsWith('vh')) {
            return Math.round(Number(val.slice(0, -2)) / 100 * vh);
        }
        if (val.endsWith('px')) {
            return Number(val.slice(0, -2));
        }
    }
    if (typeof val === 'number') {
        return val;
    }
    return 0;
}


export default function useSize(size) {
    const { state } = useContext(Store);
    const { vw, vh } = state;

    const [ inputSize, setInputSize ] = useState(size);

    return [
        calcSize(inputSize, vw, vh),
        setInputSize
    ];
}