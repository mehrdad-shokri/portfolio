import {useContext} from 'react'
import {ThemeContext} from '.'

export function useTheme() {
  return useContext(ThemeContext)
}
