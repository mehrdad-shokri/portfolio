import type {IconType} from 'components/Icon'

export interface NavLink {
  label: string
  pathname: string
}

export interface SocialLink {
  label: string
  url: string
  icon: IconType
}

export const navLinks: NavLink[] = [
  {label: 'Projects', pathname: '/#projects'},
  {label: 'About', pathname: '/#about'},
  {label: 'Blog', pathname: '/blog/'},
  {label: 'Contact', pathname: '/contact/'},
]

export const socialLinks: SocialLink[] = [
  {label: 'Linkedin', url: 'https://www.linkedin.com/in/mehrdad-shokri/', icon: 'linkedin'},
  {label: 'Github', url: 'https://github.com/mehrdad-shokri', icon: 'github'},
  {label: 'Stackoverflow', url: 'https://stackoverflow.com/users/5277245/mehrdad-shokri', icon: 'stackoverflow'},
  {label: 'Youtube', url: 'https://www.youtube.com/channel/UCTg_X3QVErq_B2MbJyZ0sUw', icon: 'youtube'},
]
