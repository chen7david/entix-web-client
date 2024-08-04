import { IGroupEntity } from 'entix-shared'
import { atom } from 'jotai'

export const editGroupAtom = atom<IGroupEntity | null>(null)
export const editGroupStatusAtom = atom<boolean>(false)
