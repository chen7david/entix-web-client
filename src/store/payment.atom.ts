import { IPayment } from 'entix-shared'
import { atom } from 'jotai'

export const editPaymentAtom = atom<IPayment | null>(null)
export const editPaymentStatusAtom = atom<boolean>(false)
