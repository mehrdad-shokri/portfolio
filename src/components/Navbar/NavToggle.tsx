import {Button} from 'components/Button'
import {Icon} from 'components/Icon'
import styles from './NavToggle.module.css'

interface NavToggleProps {
  menuOpen?: boolean
  onClick?: () => void
  [key: string]: unknown
}

export const NavToggle = ({menuOpen, ...rest}: NavToggleProps) => (
  <Button
    iconOnly
    className={styles.toggle}
    aria-label='Menu'
    aria-expanded={menuOpen}
    {...rest}
  >
    <div className={styles.inner}>
      <Icon
        className={styles.icon}
        data-menu={true}
        data-open={menuOpen}
        icon='menu'
      />
      <Icon
        className={styles.icon}
        data-close={true}
        data-open={menuOpen}
        icon='close'
      />
    </div>
  </Button>
)
