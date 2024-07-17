import { IViewUserDto, StorageKey } from 'entix-shared'
import { atom, createStore } from 'jotai'
export const authStore = createStore()

const currUser: IViewUserDto | null = JSON.parse(
  `${localStorage.getItem(StorageKey.CurrUser)}`,
)
export const currUserAtom = atom<IViewUserDto | null>(currUser)

const isLogin: boolean = localStorage.getItem(StorageKey.AccessToken) !== null
export const isLoginAtom = atom<boolean>(isLogin)
