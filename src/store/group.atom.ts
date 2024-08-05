import { IGroupWithUsersModel } from 'entix-shared'
import { atom } from 'jotai'

export const editGroupAtom = atom<IGroupWithUsersModel | null>(null)
export const editGroupStatusAtom = atom<boolean>(false)
