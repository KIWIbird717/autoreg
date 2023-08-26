import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IParseFolders, IUserState } from "./types"
import { IHeaderType } from "../pages/ApplicationPages/AccountsManager/Collumns"
import { IProxyHeaderType } from "../pages/ApplicationPages/ProxyManager/Collumns"

const initialState: IUserState = {
  nick: null,
  mail: null,
  defaultAppHash: null,
  defaultAppId: null,
  id: null,
  token: null,
  isUserLogined: false,
  userManagerFolders: null,
  userProxyFolders: null,
  userParsingFolders: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserNick: (state, action: PayloadAction<string>) => {
      state.nick = action.payload
    },
    setUserMail: (state, action: PayloadAction<string>) => {
      state.mail = action.payload
    },
    setUserDefaulAppHash: (state, action: PayloadAction<string>) => {
      state.defaultAppHash = action.payload
    },
    setUserDefaulAppId: (state, action: PayloadAction<number>) => {
      state.defaultAppId = action.payload
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.id = action.payload
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserIsLogined: (state, action: PayloadAction<boolean>) => {
      state.isUserLogined = action.payload
    },
    /**Could be empty */
    setUserManagerFolders: (state, action: PayloadAction<IHeaderType[] | null>) => {
      state.userManagerFolders = action.payload
    },
    setUserProxyFolders: (state, action: PayloadAction<IProxyHeaderType[] | null>) => {
      state.userProxyFolders = action.payload
    },
    setUserParsingFolders: (state, action: PayloadAction<IParseFolders[] | null>) => {
      state.userParsingFolders = action.payload
    }
  }
})

export const {
  setUserNick,
  setUserMail,
  setUserDefaulAppHash,
  setUserDefaulAppId,
  setUserId,
  setUserToken,
  setUserIsLogined,
  setUserManagerFolders,
  setUserProxyFolders,
  setUserParsingFolders,
} = userSlice.actions
export default userSlice.reducer