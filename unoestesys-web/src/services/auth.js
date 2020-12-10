const TOKEN_KEY = "@unoesteSYS-Token"
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const signIn = token => localStorage.setItem(TOKEN_KEY, token)
export const signOut = () => localStorage.removeItem(TOKEN_KEY)

const DARK_MODE = "@unoesteSYS-DarkMode"
export const isDarkMode = () => localStorage.getItem(DARK_MODE) !== null
export const turnOn = () => localStorage.setItem(DARK_MODE, true)
export const turnOff = () => localStorage.removeItem(DARK_MODE)