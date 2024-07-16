import { ILoginUserDto } from 'entix-shared'
import { atom } from 'jotai'
import { ZodFormattedError } from 'zod'

export type IValidationError = {
  [key: string]: {
    _errors: string[]
  }
}

export const globalFormValidationAtom = atom<IValidationError>({})

export const loginFormValidationAtom =
  atom<ZodFormattedError<ILoginUserDto> | null>(null)
