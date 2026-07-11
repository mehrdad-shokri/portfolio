'use client'

import type {MouseEvent} from 'react'
import {Icon} from 'components/Icon'
import {Monogram} from 'components/Monogram'
import {useTheme} from 'components/ThemeProvider'
import {tokens} from 'components/ThemeProvider/theme'
import {Transition} from 'components/Transition'
import {useAppContext, useScrollToHash, useWindowSize} from 'hooks'
import RouterLink from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {cssProps, media, msToNum, numToMs} from 'utils/style'
import {NavToggle} from './NavToggle'
import styles from './Navbar.module.css'
import {ThemeToggle} from './ThemeToggle'
import {navLinks, socialLinks} from './navData'

interface Measurement {
  element: Element
  top: number
  bottom: number
}

export const Navbar = () => {
  const [current, setCurrent] = useState<string | undefined>()
  const [target, setTarget] = useState<string | null | undefined>()
  const {themeId} = useTheme()
  const {menuOpen, dispatch} = useAppContext()
  const pathname = usePathname()
  const windowSize = useWindowSize()
  const headerRef = useRef<HTMLElement>(null)
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696
  const scrollToHash = useScrollToHash()

  useEffect(() => {
    setCurrent(pathname)
  }, [pathname])

  useEffect(() => {
    if (!target || pathname !== '/') return
    setCurrent(`${pathname}${target}`)
    scrollToHash(target, () => setTarget(null))
  }, [pathname, scrollToHash, target])

  useEffect(() => {
    const navItems = document.querySelectorAll('[data-navbar-item]')
    const inverseTheme = themeId === 'dark' ? 'light' : 'dark'
    const {innerHeight} = window
    let inverseMeasurements: Measurement[] = []
    let navItemMeasurements: Measurement[] = []

    const isOverlap = (r1: Measurement, r2: Measurement, scrollY: number) =>
      !(r1.bottom - scrollY < r2.top || r1.top - scrollY > r2.bottom)

    const resetNavTheme = () => {
      for (const m of navItemMeasurements)
        (m.element as HTMLElement).dataset.theme = ''
    }

    const handleInversion = () => {
      const invertedElements = document.querySelectorAll(
        `[data-theme='${inverseTheme}'][data-invert]`
      )
      if (!invertedElements) return
      inverseMeasurements = Array.from(invertedElements).map(item => ({
        element: item,
        top: (item as HTMLElement).offsetTop,
        bottom:
          (item as HTMLElement).offsetTop + (item as HTMLElement).offsetHeight,
      }))
      const {scrollY} = window
      resetNavTheme()
      for (const inv of inverseMeasurements) {
        if (inv.top - scrollY > innerHeight || inv.bottom - scrollY < 0)
          continue
        for (const m of navItemMeasurements) {
          ;(m.element as HTMLElement).dataset.theme = isOverlap(inv, m, scrollY)
            ? inverseTheme
            : ''
        }
      }
    }

    if (themeId === 'light') {
      navItemMeasurements = Array.from(navItems).map(item => {
        const rect = item.getBoundingClientRect()
        return {element: item, top: rect.top, bottom: rect.bottom}
      })
      document.addEventListener('scroll', handleInversion)
      handleInversion()
    }

    return () => {
      document.removeEventListener('scroll', handleInversion)
      resetNavTheme()
    }
  }, [themeId, windowSize, pathname])

  const getCurrent = (url = '') => {
    const nonTrailing = current?.endsWith('/') ? current.slice(0, -1) : current
    return url === nonTrailing ? 'page' : ('' as const)
  }

  const handleNavItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = (event.currentTarget as HTMLAnchorElement).href.split('#')[1]
    setTarget(null)
    if (hash && pathname === '/') {
      setTarget(`#${hash}`)
      event.preventDefault()
    }
  }

  const handleMobileNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    handleNavItemClick(event)
    if (menuOpen) dispatch({type: 'toggleMenu'})
  }

  return (
    <header className={styles.navbar} ref={headerRef}>
      <RouterLink
        href={pathname === '/' ? '/#intro' : '/'}
        scroll={false}
        data-navbar-item
        className={styles.logo}
        aria-label='Mehrdad Shokri, Developer'
        onClick={handleMobileNavClick as unknown as React.MouseEventHandler}
      >
        <Monogram highlight />
      </RouterLink>
      <NavToggle
        onClick={() => dispatch({type: 'toggleMenu'})}
        menuOpen={menuOpen}
      />
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {navLinks.map(({label, pathname: navPath}) => (
            <RouterLink
              href={navPath}
              scroll={false}
              key={label}
              data-navbar-item
              className={styles.navLink}
              aria-current={getCurrent(navPath) as 'page' | undefined}
              onClick={handleNavItemClick as unknown as React.MouseEventHandler}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        <NavbarIcons desktop />
      </nav>
      <Transition
        unmount
        in={menuOpen}
        timeout={msToNum(tokens.base.durationL)}
      >
        {visible => (
          <nav className={styles.mobileNav} data-visible={visible}>
            {navLinks.map(({label, pathname: navPath}, index) => (
              <RouterLink
                href={navPath}
                scroll={false}
                key={label}
                className={styles.mobileNavLink}
                data-visible={visible}
                aria-current={getCurrent(navPath) as 'page' | undefined}
                onClick={
                  handleMobileNavClick as unknown as React.MouseEventHandler
                }
                style={cssProps({
                  transitionDelay: numToMs(
                    Number(msToNum(tokens.base.durationS)) + index * 50
                  ),
                })}
              >
                {label}
              </RouterLink>
            ))}
            <NavbarIcons />
            <ThemeToggle isMobile />
          </nav>
        )}
      </Transition>
      {!isMobile && <ThemeToggle data-navbar-item />}
    </header>
  )
}

const NavbarIcons = ({desktop}: {desktop?: boolean}) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({label, url, icon}) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
)
