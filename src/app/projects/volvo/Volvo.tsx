'use client'

import volvoTruckPlaceholder from 'assets/volvo-placeholder.png'
import {Footer} from 'components/Footer'
import {Link} from 'components/Link'
import {deviceModels} from 'components/Model/deviceModels'
import {ThemeProvider} from 'components/ThemeProvider'
import {
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from 'layouts/Project'
import dynamic from 'next/dynamic'
import {Fragment} from 'react'
import styles from './Volvo.module.css'

const Model = dynamic(() => import('components/Model').then(mod => mod.Model))

const title = 'Volvo Group Connected Solutions'
const description =
  'I worked on trucks connectivity and fleet management at Volvo Group ' +
  'Connected Solutions — the digital arm of Volvo Group that turns every ' +
  'truck on the road into a connected, monitored, serviceable asset.'
const roles = [
  'Telematics Data Pipelines',
  'Fleet Dashboard',
  'Remote Diagnostics',
  'Map/Routing UI',
]

// The model's own paint material is recolored at load; see deviceModels.
const truckModel = {
  ...deviceModels.volvoTruck,
  // Stage the truck larger than the home-page vitrine: this canvas is the
  // full content width, so the shared 0.5 scale reads too small here.
  scale: 0.85,
  position: {x: 0, y: -1, z: 0},
  texture: {
    srcSet: [],
    placeholder: volvoTruckPlaceholder as unknown as {src: string},
    sizes: '100vw',
  },
}

export const Volvo = () => {
  return (
    <Fragment>
      <ProjectContainer className='volvo'>
        <ProjectHeader title={title} description={description} roles={roles} />
        <ThemeProvider themeId='dark' data-invert>
          <ProjectSection padding='top'>
            <ProjectSectionContent>
              <div className={styles.truck} aria-hidden='true'>
                <Model
                  className={styles.truckModel}
                  alt='Volvo FH 460 truck'
                  cameraPosition={{x: 0, y: 0, z: 8}}
                  interactionMode='drag'
                  keyLightPosition={{x: -2.5, y: 2.5, z: 4.5}}
                  models={[truckModel]}
                />
              </div>
              <ProjectTextRow center>
                <ProjectSectionHeading>The vehicle</ProjectSectionHeading>
                <ProjectSectionText>
                  Everything we built runs on trucks like this one. Each vehicle
                  that leaves the factory carries a telematics gateway that
                  streams positions, fuel consumption, driver behaviour and the
                  health of hundreds of components — the raw material for every
                  connected service downstream. Drag the truck to take a closer
                  look.
                </ProjectSectionText>
              </ProjectTextRow>
            </ProjectSectionContent>
          </ProjectSection>
        </ThemeProvider>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>The connection</ProjectSectionHeading>
            <ProjectSectionText>
              Vehicle signals — GPS, CAN bus readings, fuel telemetry, uptime
              indicators — flow from the truck to the cloud, where they are
              cleaned, aggregated and turned into services: live tracking,
              fuel-efficiency coaching, predictive maintenance and remote
              diagnostics that can flag a failing part before it strands a
              driver on the roadside.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>The fleet</ProjectSectionHeading>
            <ProjectSectionText>
              For a fleet operator the unit is never one truck — it is hundreds.
              The fleet management tools we worked on roll every connected
              vehicle up into a single operational picture: routes, utilisation,
              deviations, service planning. One truck is a data point; the fleet
              view is where the business decisions happen.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Connected services shift trucking from reactive to proactive:
                less unplanned downtime, better fuel economy and service planned
                around real component wear instead of fixed intervals. Working
                across the vehicle-to-cloud pipeline meant collaborating with
                teams from embedded firmware to frontend — and building
                interfaces that make a stream of raw telematics legible to a
                fleet operator at a glance.
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
