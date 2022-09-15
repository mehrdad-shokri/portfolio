import featherTexture2Large from 'assets/feather-home-large.png'
import featherTexture2Placeholder from 'assets/feather-home-large-placeholder.png'
import featherTexture2 from 'assets/feather-home.png'
import featherTextureLarge from 'assets/feather-days-large.png'
import featherTexturePlaceholder from 'assets/feather-days-placeholder.png'
import featherTexture from 'assets/feather-days.png'
import snappfoodTextureLarge from 'assets/snappfood-large.png'
import snappfoodTexturePlaceholder from 'assets/snappfood-placeholder.png'
import snappfoodTexture from 'assets/snappfood.png'
import {Footer} from 'components/Footer'
import {Meta} from 'components/Meta'
import {Intro} from 'layouts/Home/Intro'
import {Profile} from 'layouts/Home/Profile'
import {ProjectSummary} from 'layouts/Home/ProjectSummary'
import {useEffect, useRef, useState} from 'react'
import styles from './Home.module.css'

const disciplines = [
  'Designer',
  'Creator',
  '|-|4|<3r',
  'Cyborg',
  'Gamer',
  'Youtuber',
  'Engineer',
  'Programmer',
  'Sentient',
]

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([])
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false)
  const intro = useRef()
  const projectOne = useRef()
  const projectTwo = useRef()
  const details = useRef()

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, details]

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target
            observer.unobserve(section)
            if (visibleSections.includes(section)) return
            setVisibleSections(prevSections => [...prevSections, section])
          }
        })
      },
      {rootMargin: '0px 0px -10% 0px', threshold: 0.1}
    )

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting)
      },
      {rootMargin: '-100% 0px 0px 0px'}
    )

    sections.forEach(section => {
      sectionObserver.observe(section.current)
    })

    indicatorObserver.observe(intro.current)

    return () => {
      sectionObserver.disconnect()
      indicatorObserver.disconnect()
    }
  }, [visibleSections])

  return (
    <div className={styles.home}>
      <Meta
        title='Developer + Designer'
        description='Design portfolio of Mehrdad Shokri — a software developer working on mobile and web
          apps.'
      />
      <Intro
        id='intro'
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id='projects'
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Iran's leading online food ordering service"
        description="Snappfood's mobile app and website development"
        buttonText='View project'
        buttonLink='/projects/snappfood'
        model={{
          type: 'laptop',
          alt: 'Snappfood, food ordering service',
          textures: [
            {
              srcSet: [snappfoodTexture, snappfoodTextureLarge],
              placeholder: snappfoodTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id='project-2'
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title='Flutter Weather App'
        description='Weather App developed with Flutter, RxDart and Bloc pattern'
        buttonText='View project'
        buttonLink='https://feather.today'
        model={{
          type: 'phone',
          alt: 'Weather App',
          textures: [
            {
              srcSet: [featherTexture, featherTextureLarge],
              placeholder: featherTexturePlaceholder,
            },
            {
              srcSet: [featherTexture2, featherTexture2Large],
              placeholder: featherTexture2Placeholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id='about'
      />
      <Footer />
    </div>
  )
}
