import {createContext} from 'react';

export type ConfContext = {
    confirmObj: any
    setConfirmObj: any
    confirNumber?: string
    setConfirNumber: any
}

const ConfirmContext = createContext<ConfContext | null>(null);

export default ConfirmContext;
