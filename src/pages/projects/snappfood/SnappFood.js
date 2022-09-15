import backgroundSprLarge from 'assets/snappfood-background-large.jpg'
import backgroundSprPlaceholder from 'assets/snappfood-background-placeholder.jpg'
import backgroundSpr from 'assets/snappfood-background.jpg'
import imageSprBackgroundVolcanismLarge from 'assets/spr-background-volcanism-large.jpg'
import imageSprBackgroundVolcanismPlaceholder from 'assets/spr-background-volcanism-placeholder.jpg'
import imageSprBackgroundVolcanism from 'assets/spr-background-volcanism.jpg'
import imageSnappfoodDesignDarkLarge from 'assets/snappfood-design-dark-large.png'
import imageSnappfoodDesignDarkPlaceholder from 'assets/snappfood-design-dark-placeholder.png'
import imageSnappfoodDarkDesign from 'assets/snappfood-design-dark-large.png'
import imageSnappfoodDesignLightLarge from 'assets/snappfood-design-light-large.png'
import imageSnappfoodDesignLightPlaceholder from 'assets/snappfood-design-light-placeholder.png'
import imageSnappfoodLightDesign from 'assets/snappfood-design-light.png'
import imageSnappfoodDesignSystemDarkLarge from 'assets/snappfood-components-dark-large.png'
import imageSnappfoodDesignSystemDarkPlaceholder from 'assets/snappfood-components-dark-placeholder.png'
import imageSnappfoodDesignSystemDark from 'assets/snappfood-components-dark.png'
import imageSnappfoodDesignSystemLightLarge from 'assets/snappfood-components-light-large.png'
import imageSnappfoodDesignSystemLightPlaceholder from 'assets/snappfood-components-light-placeholder.png'
import imageSnappfoodDesignSystemLight from 'assets/snappfood-components-light.png'
import imageSnappfoodLarge from 'assets/snappfood-large.png'
import imageSnappfoodPlaceholder from 'assets/snappfood-placeholder.png'
import imageSnappfood from 'assets/snappfood.png'
import videoSnappfoodTestLarge from 'assets/snappfood-tests.mp4'
import videoSnappfoodTestPlaceholder from 'assets/snappfood-test-placeholder.png'
import videoSnappfoodTest from 'assets/snappfood-tests.mp4'
import imageSnappfoodHomePageLarge from 'assets/snappfood-home-page.png'
import imageSnappfoodHomePagePlaceholder from 'assets/snappfood-home-page-placeholder.png'
import imageSnappfoodWelcomePageLarge from 'assets/snappfood-welcome-page.png'
import imageSnappfoodWelcomePlaceholder from 'assets/snappfood-welcome-page-placeholder.png'
import imageSnappfoodPerformanceDarkLarge from 'assets/snappfood-performance-dark-large.png'
import imageSnappfoodPerformanceDarkPlaceholder from 'assets/snappfood-performance-dark-placeholder.png'
import imageSnappfoodPerformanceDark from 'assets/snappfood-performance-dark.png'
import imageSnappfoodPerformanceLightLarge from 'assets/snappfood-performance-light-large.png'
import imageSnappfoodPerformanceLightPlaceholder from 'assets/snappfood-performance-light-placeholder.png'
import imageSnappfoodPerformanceLight from 'assets/snappfood-performance-light.png'

import {Footer} from 'components/Footer'
import {Image} from 'components/Image'
import {Link} from 'components/Link'
import {Meta} from 'components/Meta'
import {
  SegmentedControl,
  SegmentedControlOption,
} from 'components/SegmentedControl'
import {ThemeProvider, useTheme} from 'components/ThemeProvider'
import {useAppContext} from 'hooks'
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionColumns,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from 'layouts/Project'
import dynamic from 'next/dynamic'
import {Fragment, useMemo} from 'react'
import {media} from 'utils/style'
import styles from './Snappfood.module.css'

const Earth = dynamic(() => import('./Earth').then(mod => mod.Earth))
const EarthSection = dynamic(() =>
  import('./Earth').then(mod => mod.EarthSection)
)

const title = 'Snappfood'
const description =
  'I worked as Frontend developer at Snappfood. ' +
  'I developed pixel perfect features on mobile app and website and improved performance in many ways. ' +
  'My main scope of work was homepage and search page of Snappfood.'
const roles = [
  'Pixel Perfect UI Implementation',
  'Unit & E2E Testing',
  'Performance Improvements',
  'Data-driven Analytics Implementation',
]

export const SnappFood = () => {
  const {themeId} = useTheme()
  const {dispatch} = useAppContext()

  const isDark = themeId === 'dark'
  const themes = ['dark', 'light']

  const handleThemeChange = index => {
    dispatch({type: 'setTheme', value: themes[index]})
  }

  return (
    <Fragment>
      <ProjectContainer className='spr'>
        <Meta title={title} prefix='Projects' description={description} />
        <ProjectBackground
          opacity={isDark ? 0.5 : 0.8}
          src={backgroundSpr}
          srcSet={`${backgroundSpr.src} 1080w, ${backgroundSprLarge.src} 2160w`}
          placeholder={backgroundSprPlaceholder}
        />
        <ProjectHeader
          title={title}
          description={description}
          url='https://snappfood.ir/'
          roles={roles}
        />
        <ProjectSection padding='top'>
          <ProjectSectionContent>
            <ProjectImage
              raised
              key={themeId}
              srcSet={[imageSnappfood, imageSnappfoodLarge]}
              placeholder={imageSnappfoodPlaceholder}
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 800px, 1000px`}
              alt='Snappfood website home page'
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>Origin Story</ProjectSectionHeading>
            <ProjectSectionText>
              Snappfood is the leading online food ordering company in Iran.
              Customers can find menus, order and be delivered from more than
              1,500 restaurants all over Iran through the Snappfood website and
              mobile application. Since its creation in 2009, Snappfood has
              continuously transformed the way people order food.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection light={isDark}>
          <ProjectSectionContent>
            <Image
              key={themeId}
              srcSet={
                isDark
                  ? [imageSnappfoodDarkDesign, imageSnappfoodDesignDarkLarge]
                  : [imageSnappfoodLightDesign, imageSnappfoodDesignLightLarge]
              }
              placeholder={
                isDark
                  ? imageSnappfoodDesignDarkPlaceholder
                  : imageSnappfoodDesignLightPlaceholder
              }
              alt={`Snappfood design system`}
              sizes='100vw'
            />
            <ProjectTextRow>
              <SegmentedControl
                currentIndex={themes.indexOf(themeId)}
                onChange={handleThemeChange}
              >
                <SegmentedControlOption>Dark theme</SegmentedControlOption>
                <SegmentedControlOption>Light theme</SegmentedControlOption>
              </SegmentedControl>
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>
                Snappfood Design System
              </ProjectSectionHeading>
              <ProjectSectionText>
                To streamline design process across designers, engineers and
                product designers for such a large project, we used Figma as our
                design and prototyping tool. All designs got handed off to
                developers in Figma and we took care of that from there.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <Image
              raised
              key={themeId}
              srcSet={
                isDark
                  ? [
                      imageSnappfoodDesignSystemDark,
                      imageSnappfoodDesignSystemDarkLarge,
                    ]
                  : [
                      imageSnappfoodDesignSystemLight,
                      imageSnappfoodDesignSystemLightLarge,
                    ]
              }
              placeholder={
                isDark
                  ? imageSnappfoodDesignSystemDarkPlaceholder
                  : imageSnappfoodDesignSystemLightPlaceholder
              }
              alt='Snappfood design system'
              sizes='100vw'
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Component Library</ProjectSectionHeading>
              <ProjectSectionText>
                We developed our custom component library with{' '}
                <Link href={'https://storybook.js.org/'} target={'_blank'}>
                  Storybook
                </Link>{' '}
                to be used in the website and mobile app. Components library is
                styled with styled-components and developed in Typescript to
                increase library&apos;s readability and maintainability. We rely
                on Typescript&apos;s types and interfaces for components typing
                and props documentation.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ThemeProvider themeId='dark' data-invert>
          <ProjectSection
            backgroundOverlayOpacity={0.5}
            backgroundElement={
              <Image
                srcSet={[
                  imageSprBackgroundVolcanism,
                  imageSprBackgroundVolcanismLarge,
                ]}
                placeholder={imageSprBackgroundVolcanismPlaceholder}
                alt='A dramatic ocean scene with lava forming a new land mass.'
                sizes='100vw'
              />
            }
          >
            <ProjectSectionColumns width='full'>
              <ProjectSectionContent width='full'>
                <ProjectTextRow width='s'>
                  <ProjectSectionHeading>Testing</ProjectSectionHeading>
                  <ProjectSectionText>
                    Used{' '}
                    <Link href={'https://www.cypress.io/'} target={'_blank'}>
                      Cypress
                    </Link>{' '}
                    to test our workflow and features thoroughly. Also used{' '}
                    <Link href={'https://jestjs.io/'} target={'_blank'}>
                      Jest
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={
                        'https://testing-library.com/docs/react-testing-library/intro/'
                      }
                      target={'_blank'}
                    >
                      React Testing Library
                    </Link>{' '}
                    for unit testing our components in isolation.
                  </ProjectSectionText>
                </ProjectTextRow>
              </ProjectSectionContent>
              <Image
                raised
                className={styles.video}
                srcSet={[
                  {src: videoSnappfoodTest, width: 1280},
                  {src: videoSnappfoodTestLarge, width: 2560},
                ]}
                placeholder={videoSnappfoodTestPlaceholder}
                alt='A learning designer building and deploying an interactive lesson on volcanism using the app.'
                sizes={`(max-width: ${media.mobile}px) 100vw, 50vw`}
              />
            </ProjectSectionColumns>
          </ProjectSection>
        </ThemeProvider>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>
                Performance Improvements
              </ProjectSectionHeading>
              <ProjectSectionText>
                A major part of our efforts was improving performance in every
                way possible; we got our measures like page load time, LCP, FCP,
                API load time, etc. from Google Analytics and our internal
                analytics tools. We also continually analysed our bundle size
                and core{' '}
                <Link href={'https://web.dev/vitals/'} target={'_blank'}>
                  Web Vitals
                </Link>{' '}
                through Chrome in every release. Overall I improved performance
                by dynamic imports (React Suspense), lazy loading components
                (IntersectionObserver), virtualizing lists, memoizing data, lazy
                loading images, and requests caching (with cache invalidation
                timeouts).
              </ProjectSectionText>
            </ProjectTextRow>
            <Image
              raised
              key={themeId}
              srcSet={
                isDark
                  ? [
                      imageSnappfoodPerformanceDark,
                      imageSnappfoodPerformanceDarkLarge,
                    ]
                  : [
                      imageSnappfoodPerformanceLight,
                      imageSnappfoodPerformanceLightLarge,
                    ]
              }
              placeholder={
                isDark
                  ? imageSnappfoodPerformanceDarkPlaceholder
                  : imageSnappfoodPerformanceLightPlaceholder
              }
              alt='Snappfood performance analytics in Chrome Lighthouse'
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionColumns>
            <ProjectSectionContent>
              <ProjectTextRow>
                <ProjectSectionHeading>
                  Developing Pixel Perfect UI
                </ProjectSectionHeading>
                <ProjectSectionText>
                  Developing new features that would help customer retention and
                  conversion rates and implementing existing features redesign
                  was part of my daily routine at Snappfood.
                </ProjectSectionText>
              </ProjectTextRow>
            </ProjectSectionContent>
            <div className={styles.sidebarImages}>
              <Image
                className={styles.sidebarImage}
                src={imageSnappfoodWelcomePageLarge}
                placeholder={imageSnappfoodWelcomePlaceholder}
                alt='Snappfood welcome page'
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
              <Image
                className={styles.sidebarImage}
                src={imageSnappfoodHomePageLarge}
                placeholder={imageSnappfoodHomePagePlaceholder}
                alt='Snappfood home page'
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ThemeProvider themeId='dark' data-invert>
          <Earth
            className={styles.earth}
            hideMeshes={useMemo(
              () => ['Atmosphere', 'EarthPartial', 'Chunk', 'EarthFull'],
              []
            )}
            position={useMemo(() => [0, 0, 0], [])}
            labels={useMemo(
              () => [
                {
                  position: [0.54, 0.19, 0.18],
                  text: 'Chapter meetings',
                  hidden: true,
                },
                {
                  position: [0.47, -0.38, 0.04],
                  text: 'Code review',
                  hidden: true,
                },
                {
                  position: [0.22, 0.44, -0.35],
                  text: 'Onboarding',
                  hidden: true,
                },
                {
                  position: [0.16, -0.06, 0.58],
                  text: 'Peer programming',
                  hidden: true,
                },
                {
                  position: [0.11, 0.2, -0.56],
                  text: 'Knowledge sharing',
                  hidden: true,
                },
                {
                  position: [0.52, 0.2, -0.23],
                  text: 'Teamplayer',
                  hidden: true,
                },
                {
                  position: [-0.24, 0.75, 0.24],
                  text: 'Develop',
                  delay: 800,
                  hidden: true,
                },
                {
                  position: [-0.24, 0.55, 0.24],
                  text: 'Product',
                  delay: 800,
                  hidden: true,
                },
                {
                  position: [-0.24, 0.35, 0.24],
                  text: 'OKR',
                  delay: 800,
                  hidden: true,
                },
              ],
              []
            )}
            scale={0.6}
          >
            <EarthSection
              scrim
              animations={['0:loop']}
              camera={[0, 0, 1.5]}
              meshes={['Atmosphere', 'EarthFull']}
            >
              <ProjectSection>
                <ProjectSectionContent>
                  <ProjectTextRow center>
                    <ProjectSectionHeading>
                      Being a good teammate
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      I really felt people working at Snappfood, were the ones
                      who planned the product&apos;s future and decided
                      it&apos;s priorities. We held quarterly OKR sessions to
                      decide on objectives.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </EarthSection>
            <EarthSection
              animations={['0:loop']}
              camera={[0, 0, 2.4]}
              meshes={['Atmosphere', 'EarthFull']}
            />
            <EarthSection
              animations={['0:loop']}
              camera={[1.14, -1.39, 0.94]}
              meshes={['Atmosphere', 'EarthFull']}
            >
              <ProjectSection>
                <ProjectSectionContent width='xl'>
                  <ProjectTextRow justify='end' width='s'>
                    <ProjectSectionHeading level={4} as='h3'>
                      OKR sessions
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      We held quarterly OKR sessions that we would discuss Key
                      Results and brainstorm what our squad could propose in
                      terms of features/value proposition as Objectives.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </EarthSection>
            <EarthSection
              animations={['0:loop']}
              camera={[1.17, 0.69, -1.47]}
              meshes={['Atmosphere', 'EarthFull']}
              labels={[
                'Chapter meetings',
                'Code review',
                'Onboarding',
                'Peer programming',
                'Knowledge sharing',
                'Teamplayer',
              ]}
            >
              <ProjectSection>
                <ProjectSectionContent width='xl'>
                  <ProjectTextRow justify='start' width='s'>
                    <ProjectSectionHeading level={4} as='h3'>
                      Product & UX Design
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      From there product owners, UX researchers and UI designers
                      would work on proposed objectives and come up with
                      features and designs
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </EarthSection>
            <EarthSection
              animations={['0:loop']}
              camera={[1.81, 0.51, 0.43]}
              meshes={['Atmosphere', 'EarthFull']}
              labels={[
                'Chapter meetings',
                'Code review',
                'Onboarding',
                'Peer programming',
                'Knowledge sharing',
                'Teamplayer',
              ]}
            />
            <EarthSection
              animations={['0:loop']}
              camera={[0.37, 1.02, 1.84]}
              meshes={['EarthPartial', 'Chunk']}
              labels={['OKR', 'Product', 'Develop']}
            >
              <ProjectSection>
                <ProjectSectionContent width='xl'>
                  <ProjectTextRow justify='end' width='s'>
                    <ProjectSectionHeading level={4} as='h3'>
                      Development
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      After grooming and planning sessions, we would start
                      developing features handed off to us as Figma designs in 2
                      week long sprints.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </EarthSection>
            <EarthSection
              scrimReverse
              animations={['0:loop']}
              camera={[0.37, 1.02, 1.84]}
              meshes={['Atmosphere', 'EarthFull']}
            />
          </Earth>
        </ThemeProvider>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                We&apos;ve been able to improve performance in terms of code and
                business by measuring key metrics and working from there. In
                code metrics like LCP, TTFB, TBT, etc. and in business metrics
                like bounce rate, retention rate, conversion rate, etc.
                We&apos;ve also increased code quality and maintainability by
                migrating to Typescript, using our own component library and
                imposing unified code style in all Frontend squads and making
                tests mandatory for every code that we write!
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  )
}
