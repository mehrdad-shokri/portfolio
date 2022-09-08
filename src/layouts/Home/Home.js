import gamestackTexture2Large from 'assets/gamestack-list-large.jpg'
import gamestackTexture2Placeholder from 'assets/gamestack-list-placeholder.jpg'
import gamestackTexture2 from 'assets/gamestack-list.jpg'
import gamestackTextureLarge from 'assets/gamestack-login-large.jpg'
import gamestackTexturePlaceholder from 'assets/gamestack-login-placeholder.jpg'
import gamestackTexture from 'assets/gamestack-login.jpg'
import sliceTextureLarge from 'assets/slice-app-large.jpg'
import sliceTexturePlaceholder from 'assets/slice-app-placeholder.jpg'
import sliceTexture from 'assets/slice-app.jpg'
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
  const projectThree = useRef()
  const details = useRef()

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, details]

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
        description='Developing mobile app and website of Snappfood'
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
        title='Opensource Weather App'
        description='Weather app developed with Flutter, RxDart and Bloc pattern'
        buttonText='View Repository'
        buttonLink='https://github.com/mehrdad-shokri/feather'
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: [gamestackTexture, gamestackTextureLarge],
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: [gamestackTexture2, gamestackTexture2Large],
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id='project-3'
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title='Biomedical image collaboration'
        description='Increasing the amount of collaboration in Slice, an app for biomedical imaging'
        buttonText='View project'
        buttonLink='/projects/slice'
        model={{
          type: 'laptop',
          alt: 'Annotating a biomedical image in the Slice app',
          textures: [
            {
              srcSet: [sliceTexture, sliceTextureLarge],
              placeholder: sliceTexturePlaceholder,
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
