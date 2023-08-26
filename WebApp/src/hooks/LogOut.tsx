import { setUserIsLogined, setUserMail, setUserId, setUserNick } from '../store/userSlice'
import { setAppPage, setAccountsManagerFolder } from '../store/appSlice'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'

/**
 * Log out user
 */
export const LogOut = (dispatch: Dispatch<AnyAction>) => {
  return (
    // Clear user data
    dispatch(setUserMail('')),
    dispatch(setUserIsLogined(false)),
    dispatch(setUserId(0)),
    dispatch(setUserNick('')),
    // Clear app data
    dispatch(setAppPage('1')),
    dispatch(setAccountsManagerFolder(null)),
    localStorage.setItem('sessionToken', '')
  )
}
