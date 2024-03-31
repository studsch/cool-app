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
    login: string
    number: string
    confirmResult?: ConfirmationResult
    startTime: any
    updateNumber: (number: string) => void
    updateLogin: (login: string) => void
    updateConfirmResult: (confirmResult: any) => void
    updateStartTime: (startTime: any) => void
}

export const useConfirmCode = create<ConfirmState>()(persist(devtools((set => ({
    number: "", confirmResult: undefined, startTime: null, login: "",
    updateNumber: (number) => set({number: number}),
    updateConfirmResult: (confirmResult) => set({confirmResult: confirmResult}),
    updateStartTime: (startTime) => set({startTime: startTime}),
    updateLogin: (login) => set({login: login})
}))), {name: "confirmStore", version: 1}))