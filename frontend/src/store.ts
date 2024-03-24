import { any, number } from 'zod'
import {create} from 'zustand'

import {persist, devtools} from 'zustand/middleware'

interface ConfirmState {
    number: string
    confirmResult: any
    startTime: any
    updateNumber: (number: string) => void
    updateConfirmResult: (confirmResult: any) => void
    updateStartTime: (startTime: any) => void
}

export const useConfirmCode = create<ConfirmState>()(persist(devtools((set => ({
    number: "", confirmResult: null, startTime: null,
    updateNumber: (number) => set({number: number}),
    updateConfirmResult: (confirmResult) => set({confirmResult: confirmResult}),
    updateStartTime: (startTime) => set({startTime: startTime})
}))), {name: "confirmStore", version: 1}))