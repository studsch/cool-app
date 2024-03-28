import { any, number } from 'zod'
import {create} from 'zustand'

// для подтверждения по телефону через firebase

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

import {persist, devtools} from 'zustand/middleware'

interface ConfirmState {
    number: string
    confirmResult: any
    startTime: any
    isLoadLocalStorage: boolean
    updateNumber: (number: string) => void
    updateConfirmResult: (confirmResult: any) => void
    updateStartTime: (startTime: any) => void
}

export const useConfirmCode = create<ConfirmState>()(persist(devtools((set => ({
    number: "", confirmResult: null, startTime: null, isLoadLocalStorage: false,
    updateNumber: (number) => set({number: number}),
    updateConfirmResult: (confirmResult) => set({confirmResult: confirmResult}),
    updateStartTime: (startTime) => set({startTime: startTime})
}))), {name: "confirmStore", version: 1}))