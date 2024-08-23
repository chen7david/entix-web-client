import { IUser } from 'entix-shared'
import { atom } from 'jotai'

export const editUserAtom = atom<IUser | null>(null)
export const editUserStatusAtom = atom<boolean>(false)
export const manageWalletStatusAtom = atom<boolean>(false)
