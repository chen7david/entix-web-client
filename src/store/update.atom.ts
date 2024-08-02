import { IViewUserDto } from 'entix-shared'
import { atom } from 'jotai'

export const editUserAtom = atom<IViewUserDto | null>(null)
export const editUserStatusAtom = atom<boolean>(false)
export const manageWalletStatusAtom = atom<boolean>(false)
