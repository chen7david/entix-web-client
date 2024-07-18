import { IViewUserDto, StorageKey } from 'entix-shared'

export class BrowserStore {
  static get(key: string) {
    return JSON.parse(`${localStorage.getItem(key)}`)
  }

  static set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static remove(key: string): void {
    localStorage.removeItem(key)
  }

  static clear(): void {
    localStorage.clear()
  }

  static getAccessToken(): string | null {
    return BrowserStore.get(StorageKey.AccessToken)
  }

  static setAccessToken(accessToken: string): void {
    BrowserStore.set(StorageKey.AccessToken, accessToken)
  }

  static removeAccessToken(): void {
    BrowserStore.remove(StorageKey.AccessToken)
  }

  static getRefreshToken(): string | null {
    return BrowserStore.get(StorageKey.RefreshToken)
  }

  static setRefreshToken(refreshToken: string): void {
    BrowserStore.set(StorageKey.RefreshToken, refreshToken)
  }

  static removeRefreshToken(): void {
    BrowserStore.remove(StorageKey.RefreshToken)
  }

  static getCurrUser(): IViewUserDto | null {
    return BrowserStore.get(StorageKey.CurrUser)
  }

  static setCurrUser(user: IViewUserDto): void {
    BrowserStore.set(StorageKey.CurrUser, user)
  }

  static removeCurrUser(): void {
    BrowserStore.remove(StorageKey.CurrUser)
  }

  static getIsAdmin(): boolean {
    return BrowserStore.get(StorageKey.IsAdmin)
  }

  static setIsAdmin(isAdmin: boolean): void {
    BrowserStore.set(StorageKey.IsAdmin, isAdmin)
  }

  static removeIsAdmin(): void {
    BrowserStore.remove(StorageKey.IsAdmin)
  }
}
