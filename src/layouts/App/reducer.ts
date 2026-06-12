import type {ThemeId} from 'components/ThemeProvider'

export interface AppState {
  menuOpen: boolean
  theme?: ThemeId
}

export type AppAction =
  | {type: 'setTheme'; value: ThemeId}
  | {type: 'toggleTheme'}
  | {type: 'toggleMenu'}

export const initialState: AppState = {
  menuOpen: false,
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setTheme':
      return {...state, theme: action.value}
    case 'toggleTheme':
      return {...state, theme: (state.theme ?? 'dark') === 'dark' ? 'light' : 'dark'}
    case 'toggleMenu':
      return {...state, menuOpen: !state.menuOpen}
    default:
      throw new Error()
  }
}
