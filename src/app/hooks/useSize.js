import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSize } from '../appSlice';

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
    const { vw, vh } = useSelector(selectSize);

    const [ inputSize, setInputSize ] = useState(size);

    return [
        calcSize(inputSize, vw, vh),
        setInputSize
    ];
}