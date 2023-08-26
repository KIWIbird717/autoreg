import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import appSlice from './appSlice'


export default  configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
  },
  /**
   * You cant set up more middlewares
   * Check instruction: @see https://redux-toolkit.js.org/api/serializabilityMiddleware
   */
  middleware: (gDM) => gDM({serializableCheck: false})
})

const rootReducer = combineReducers({
  user: userSlice,
  app: appSlice
})

export type StoreState = ReturnType<typeof rootReducer>