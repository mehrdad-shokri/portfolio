import type {AppState, AppAction} from 'layouts/App/reducer'
import {AppContext} from 'app/providers'
import {useContext} from 'react'

export interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>
}

export function useAppContext(): AppContextValue {
  return useContext(AppContext) as AppContextValue
}
