'use client'

import backgroundVolvoPlaceholder from 'assets/volvo-background-placeholder.jpg'
import backgroundVolvo from 'assets/volvo-background.jpg'
import {Footer} from 'components/Footer'
import {Link} from 'components/Link'
import {ThemeProvider, useTheme} from 'components/ThemeProvider'
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from 'layouts/Project'
import dynamic from 'next/dynamic'
import {Fragment, useMemo} from 'react'
import styles from './Volvo.module.css'

const Truck = dynamic(() => import('./Truck').then(mod => mod.Truck))
const TruckSection = dynamic(() =>
  import('./Truck').then(mod => mod.TruckSection)
)

const title = 'Volvo Group Connected Solutions'
const description =
  'At Volvo Group Connected Solutions I worked across the stack: the ' +
  'frontends fleet operators use to inspect and act on their vehicles, and ' +
  'the data pipelines and search engine that make every connected vehicle ' +
  'findable in milliseconds.'
const roles = [
  'Frontend Development',
  'Fleet & Vehicle Products',
  'Backend Data Pipelines',
  'Search at Scale',
]

// One full turntable rotation every ~16s, matching the home-page vitrine.
const turntableSpin = (2 * Math.PI) / 16
// Heading for the drive-off exit: nose pointing screen-right (+x).
const driveOffYaw = (3 * Math.PI) / 2

export const Volvo = () => {
  const {themeId} = useTheme()
  const isDark = themeId === 'dark'

  return (
    <Fragment>
      <ProjectContainer className='volvo'>
        <ProjectBackground
          className={styles.background}
          opacity={isDark ? 0.4 : 0.8}
          src={backgroundVolvo}
          srcSet={[{src: backgroundVolvo as string, width: 1280}]}
          placeholder={{src: backgroundVolvoPlaceholder as string}}
        />
        <ProjectHeader title={title} description={description} roles={roles} />
        <ThemeProvider themeId='dark' data-invert>
          <Truck
            position={useMemo(() => [0, -0.8, 0], [])}
            scale={0.6}
            labels={useMemo(
              () => [
                {
                  position: [0.25, 1.2, 0.8],
                  text: 'Connectivity',
                  hidden: true,
                },
                {
                  position: [1, -0.5, 0.7],
                  text: 'ECU data',
                  hidden: true,
                },
                {
                  position: [-1, -0.65, 0],
                  text: 'Fuel telemetry',
                  hidden: true,
                },
                {
                  position: [0, 0.5, -1.7],
                  text: 'Position',
                  hidden: true,
                },
              ],
              []
            )}
          >
            <TruckSection scrim camera={[0, 0.4, 6]} spin={turntableSpin}>
              <ProjectSection>
                <ProjectSectionContent>
                  <ProjectTextRow center>
                    <ProjectSectionHeading>The vehicle</ProjectSectionHeading>
                    <ProjectSectionText>
                      Every truck like this one is a rolling data source: its
                      telematics unit streams ECU readings, positions and fuel
                      data over the air. We turned that raw stream into the
                      connectivity services fleet operators rely on. Drag the
                      truck to take a closer look at where the data starts.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </TruckSection>
            <TruckSection
              camera={[2.2, 0.8, 3.4]}
              labels={[
                'Connectivity',
                'ECU data',
                'Fuel telemetry',
                'Position',
              ]}
            >
              <ProjectSection>
                <ProjectSectionContent width='xl'>
                  <ProjectTextRow justify='end' width='s'>
                    <ProjectSectionHeading level={4} as='h3'>
                      One truck, every signal
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      A connected truck reports on everything from its ECUs to
                      its connectivity status. I built the frontend of the
                      vehicle overview product — the single place where all of a
                      vehicle&apos;s data comes together, tab by tab, for the
                      people who need to understand one specific truck.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </TruckSection>
            <TruckSection camera={[0, 6, 16]} yaw={driveOffYaw}>
              <ProjectSection>
                <ProjectSectionContent width='xl'>
                  <ProjectTextRow justify='start' width='s'>
                    <ProjectSectionHeading level={4} as='h3'>
                      The fleet
                    </ProjectSectionHeading>
                    <ProjectSectionText>
                      For a fleet operator the unit is never one truck — it is
                      hundreds. I built the frontend of the fleet management
                      page: every vehicle&apos;s status at a glance, with
                      actions an operator can take on any single truck — down to
                      pinging it — without losing the fleet-wide picture.
                    </ProjectSectionText>
                  </ProjectTextRow>
                </ProjectSectionContent>
              </ProjectSection>
            </TruckSection>
            <TruckSection
              scrimReverse
              camera={[0, 1, 9]}
              yaw={driveOffYaw}
              offset={[16, 0, 0]}
            />
          </Truck>
        </ThemeProvider>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Vehicle data at this scale is owned by many teams, and no single
                system held the whole truth. The work I shipped closed that gap:
                a search that resolves any fragment of information to the right
                vehicle in milliseconds, a vehicle overview that reads as one
                coherent record, and a fleet view that extends the same clarity
                across hundreds of trucks. The outcome is easy to state and hard
                to overvalue — the people who run and support these fleets spend
                their time acting on information instead of hunting for it.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding='none'>
          <ProjectSectionContent>
            <ProjectTextRow center>
              <ProjectSectionText className={styles.credit}>
                3D model: &ldquo;Volvo FH 460&rdquo; by{' '}
                <Link href='https://sketchfab.com/Rick_modding_'>
                  Rick_modding
                </Link>
                , licensed under{' '}
                <Link href='https://creativecommons.org/licenses/by/4.0/'>
                  CC BY 4.0
                </Link>
                , via{' '}
                <Link href='https://sketchfab.com/3d-models/volvo-fh-460-rick-modding-dcd13ab86e1e469d9daa83d4cbca669e'>
                  Sketchfab
                </Link>
                . Modified (optimized for web).
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  )
}
