import { IPaymentPlan } from 'entix-shared'
import { atom } from 'jotai'

export const editPaymentPlanAtom = atom<IPaymentPlan | null>(null)
export const editPaymentPlanStatusAtom = atom<boolean>(false)
