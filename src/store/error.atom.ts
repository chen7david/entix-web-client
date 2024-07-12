import { atom } from 'jotai'

type IValidationError = {
  [key: string]: {
    _errors: string[]
  }
}

export const validationErrorAtom = atom<IValidationError>({})
