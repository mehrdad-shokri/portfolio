import profileKatakana from 'assets/katakana-profile.svg?url'
import profileImgLarge from 'assets/profile-large.jpeg'
import profileImgPlaceholder from 'assets/profile-placeholder.jpeg'
import profileImg from 'assets/profile.jpeg'
import {Button} from 'components/Button'
import {DecoderText} from 'components/DecoderText'
import {Divider} from 'components/Divider'
import {Heading} from 'components/Heading'
import {Image} from 'components/Image'
import {Link} from 'components/Link'
import {Section} from 'components/Section'
import {Text} from 'components/Text'
import {Transition} from 'components/Transition'
import {Fragment, useState} from 'react'
import {media} from 'utils/style'
import styles from './Profile.module.css'

const ProfileText = ({visible, titleId}) => (
  <Fragment>
    <Heading
      className={styles.title}
      data-visible={visible}
      level={3}
      id={titleId}
    >
      <DecoderText text='Hi there' start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size='l' as='p'>
      I&apos;m Mehrdad, currently I live in Tehran working as Frontend developer
      at <Link href='https://snappfood.ir/'>Snappfood</Link>. I&apos;ve always
      been curious about figuring out how things work; let that be physics of
      this world, mathematics or the other framework&apos;s API. And I guess
      that&apos;s what drives me. If you’re interested in the tools and software
      I use check my <Link href='/uses'>uses page</Link>.
    </Text>
    <Text className={styles.description} data-visible={visible} size='l' as='p'>
      In my spare time I like to watch movies, play video games, and{' '}
      <Link
        href='https://www.youtube.com/channel/UCTg_X3QVErq_B2MbJyZ0sUw'
        target={'_blank'}
      >
        make videos
      </Link>
      . I&apos;m always down for hearing about new projects, so feel free to
      drop me a line.
    </Text>
  </Fragment>
)

export const Profile = ({id, visible, sectionRef}) => {
  const [focused, setFocused] = useState(false)
  const titleId = `${id}-title`

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as='section'
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {visible => (
          <div className={styles.content}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href='/contact'
                icon='send'
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth='64px'
                  notchHeight='8px'
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About Me
                </div>
              </div>
              <div className={styles.image}>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImgPlaceholder}
                  srcSet={[profileImg, profileImgLarge]}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt='Me standing in front of the Torii on Miyajima, an island off the coast of Hiroshima in Japan'
                />
                <svg
                  aria-hidden='true'
                  width='135'
                  height='765'
                  viewBox='0 0 135 765'
                  className={styles.svg}
                  data-visible={visible}
                >
                  <use href={`${profileKatakana}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  )
}
