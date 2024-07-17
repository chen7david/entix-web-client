import { ICreateUserDto, ILoginUserDto } from 'entix-shared'
import { atom } from 'jotai'
import { ZodFormattedError } from 'zod'

export const loginFormValidationAtom =
  atom<ZodFormattedError<ILoginUserDto> | null>(null)

export const createUserFormValidationAtom =
  atom<ZodFormattedError<ICreateUserDto> | null>(null)
