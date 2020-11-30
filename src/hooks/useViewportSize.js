import { useContext } from 'react';
import Store from '../store/Store';


export default function useViewportSize() {
    const { state } = useContext(Store);
    const { vw, vh } = state;

    return { vw, vh };
}