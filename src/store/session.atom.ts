import { ISession } from 'entix-shared'
import { atom } from 'jotai'

export const editSessionAtom = atom<ISession | null>(null)
export const editSessionStatusAtom = atom<boolean>(false)
