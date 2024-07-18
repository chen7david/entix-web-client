import { IViewUserDto } from 'entix-shared'
import { atom, createStore } from 'jotai'
import { BrowserStore } from './browserstore.store'
export const authStore = createStore()

const currUser = BrowserStore.getCurrUser()
export const currUserAtom = atom<IViewUserDto | null>(currUser)

const isLogin = BrowserStore.getAccessToken() !== null
export const isLoginAtom = atom<boolean>(isLogin)

const isAdmin = BrowserStore.getIsAdmin()
export const isAdminAtom = atom<boolean>(isAdmin)
