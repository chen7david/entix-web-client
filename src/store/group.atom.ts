import { IGroup } from 'entix-shared'
import { atom } from 'jotai'

export const editGroupAtom = atom<IGroup | null>(null)
export const editGroupStatusAtom = atom<boolean>(false)
