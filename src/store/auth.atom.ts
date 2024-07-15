import { IViewUserDto } from 'entix-shared'
import { atom, createStore } from 'jotai'
export const authStore = createStore()

const currUserString = localStorage.getItem('currUser')
const currUser: IViewUserDto | null = currUserString
  ? JSON.parse(currUserString)
  : null
export const currUserAtom = atom<IViewUserDto | null>(currUser)

const isLoginString = localStorage.getItem('isLogin')
const isLogin: boolean = isLoginString ? JSON.parse(isLoginString) : false
export const isLoginAtom = atom<boolean>(isLogin)
