import { setAccountsManagerFolder, setProxyManagerFolder } from '../store/appSlice'
import { Dispatch } from 'react'
import { AnyAction } from 'redux'

/**
 * Used to `reset` App page data 
 * Clear only data located in `redux store`
 */
export const resetPageData = (dispatch: Dispatch<AnyAction>) => {
  return (
    dispatch(setAccountsManagerFolder(null)),
    dispatch(setProxyManagerFolder(null))
  )
}
