import usesBackgroundPlaceholder from 'assets/uses-background-placeholder.jpg'
import usesBackground from 'assets/uses-background.mp4'
import {Footer} from 'components/Footer'
import {Link} from 'components/Link'
import {List, ListItem} from 'components/List'
import {Meta} from 'components/Meta'
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableRow,
} from 'components/Table'
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
import {Fragment} from 'react'
import styles from './Uses.module.css'

export const Uses = () => {
  return (
    <Fragment>
      <Meta
        title='Uses'
        description='A list of hardware and software I use to get things done'
      />
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={{src: usesBackground}}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title='Uses'
          description="A somewhat comprehensive list of tools, apps, software, hardware, and more that I use on a daily basis to get shit done. Over periods of time, people grow their own unique taste in tech and here's mine; so please take it with a grain of salt.  And yeah, that is Johnny Mnemonic in the background."
        />
        <ProjectSection padding='none' className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width='m'>
              <ProjectSectionHeading>Development</ProjectSectionHeading>
              <ProjectSectionText as='div'>
                <List>
                  <ListItem>
                    I use{' '}
                    <Link target={'_blank'} href='https://www.jetbrains.com/'>
                      JetBrains IDEs
                    </Link>{' '}
                    as my preferred editor, with Material Theme UI and Atom
                    Material Icons plugin; and Operator Mono as my typeface of
                    choice.
                  </ListItem>
                  <ListItem>
                    I use both{' '}
                    <Link href={'https://getfedora.org/'} target={'_blank'}>
                      Fedora
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={'https://www.apple.com/macos/monterey/'}
                      target={'_blank'}
                    >
                      macOS
                    </Link>{' '}
                    on a daily basis because I love aesthetics of macOS and
                    freedom of Linux.
                  </ListItem>
                  <ListItem>
                    Chrome is my main browser for both development and general
                    use. But I make sure my code is running smoothly on both{' '}
                    <Link href={'https://webkit.org/'} target={'_blank'}>
                      WebKit(Safari)
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={'https://wiki.mozilla.org/Gecko:Overview'}
                      target={'_blank'}
                    >
                      Gecko(Firefox)
                    </Link>
                    . Believe me you need to check your site on iOS Safari.
                    I&apos;ve seen surprising bugs related to scroll areas and
                    CSS display property behaving differently in Safari!
                  </ListItem>
                  <ListItem>
                    <Link href='https://reactjs.org/' target={'_blank'}>
                      React
                    </Link>{' '}
                    is my front end Javascript{' '}
                    <Link
                      href={
                        'https://twitter.com/youyuxi/status/1454318316651114498'
                      }
                      target={'_blank'}
                    >
                      <s>library</s>
                    </Link>{' '}
                    <Link
                      href={
                        'https://twitter.com/youyuxi/status/1341122873461780483'
                      }
                      target={'_blank'}
                    >
                      <b>framework</b>
                    </Link>{' '}
                    of choice. I write my components in{' '}
                    <Link
                      href={'https://www.typescriptlang.org/'}
                      target={'_blank'}
                    >
                      Typescript
                    </Link>{' '}
                    because of it&apos;s type(surprise) system, generics and
                    assistance in code readability and maintenance. Since I
                    learnt it back in{' '}
                    <Link
                      href={
                        'https://github.com/mehrdad-shokri/ashojash-web/blob/master/resources/assets/js/src/components/hoc/Panel.jsx'
                      }
                      target={'_blank'}
                    >
                      2015
                    </Link>
                    , I&apos;ve never looked back again because of it&apos;s
                    reactive state model, components concept and lately;
                    it&apos;s hook mental model which all are really empowering.
                    Before React, I&apos;ve used KnockoutJS, BackboneJs and of
                    course JQuery! I might try another framework in the future;
                    the most prominent one under my radar;{' '}
                    <Link href={'https://svelte.dev/'} target={'_blank'}>
                      Svelte
                    </Link>
                    . (Sorry{' '}
                    <Link href={'https://angular.io/'} target={'_blank'}>
                      Angular
                    </Link>
                    ,{' '}
                    <Link href={'https://vuejs.org/'} target={'_blank'}>
                      Vue
                    </Link>
                    )
                  </ListItem>
                  <ListItem>
                    I also tend to use{' '}
                    <Link href={'https://nextjs.org/'} target={'_blank'}>
                      Next.js
                    </Link>{' '}
                    on top of React because of SSR needs(maybe until React
                    server components are a thing) and data flows. I&apos;ve
                    also come to have a resistant feeling towards Redux (after
                    many years using it); my preferred alternative is{' '}
                    <Link
                      href={'https://tanstack.com/query/v4'}
                      target={'_blank'}
                    >
                      React Query
                    </Link>{' '}
                    combined with React&apos;s own states, effects and contexts!
                    I might also give{' '}
                    <Link href={'https://remix.run'} target={'_blank'}>
                      Remix
                    </Link>{' '}
                    a try in the near future because it seems to have a cleaner
                    data flow approach!
                  </ListItem>
                  <ListItem>
                    After using bare metal VPS servers for years, configuring
                    Linux servers(CentOS), setting up firewalls, systemd, redis,
                    mysql, etc. on the server and running services inside Docker
                    and Docker Compose; I&apos;ve decided to put all my eggs in{' '}
                    <Link href={'https://aws.amazon.com/'} target={'_blank'}>
                      AWS
                    </Link>{' '}
                    and never think of infrastructure maintenance again. (Yeah
                    shut up and take my money) I&apos;m now a servile of AWS and
                    services like Lambda, Amplify, AppSync, API Gateways,
                    DynamoDB, RDS, Cognito, VPC, SQS, SNS, S3 and others!
                  </ListItem>
                  <ListItem>
                    I use PHP and Node.js for backend development. I still love{' '}
                    <Link href={'https://laravel.com'} target={'_blank'}>
                      Laravel
                    </Link>{' '}
                    for it&apos;s simplicity and ease of use; and would use it
                    if I wanted to implement a monolith application (which is a
                    good choice for MVPs in my opinion) but these days I prefer{' '}
                    <Link href={'https://expressjs.com/'} target={'_blank'}>
                      Express.js
                    </Link>
                    /<Link href={'https://docs.nestjs.com/'}>NestJS</Link>{' '}
                    applications deployed as lambda functions . Also I love to
                    learn about{' '}
                    <Link href={'https://go.dev/'} target={'_blank'}>
                      Go
                    </Link>
                    , which I think will be my next programming language.
                  </ListItem>
                  <ListItem>
                    I&apos;ve developed{' '}
                    <Link
                      href={
                        'https://github.com/mehrdad-shokri/ashojash-android'
                      }
                      target={'_blank'}
                    >
                      native
                    </Link>{' '}
                    Android applications with Java many years ago. After using
                    React for a few years, I gave React Native a{' '}
                    <Link
                      href={
                        'https://github.com/mehrdad-shokri/react-native-calendar'
                      }
                      target={'_blank'}
                    >
                      try
                    </Link>{' '}
                    but didn&apos;t like it because of many reasons (UI element
                    not looking native, let alone being 3rd party packages, not
                    having a suitable routing system as opposed to react-router
                    on web and not feeling native to me overall) so gave{' '}
                    <Link href={'https://flutter.dev/'} target={'_blank'}>
                      Flutter
                    </Link>{' '}
                    a try and fell in L❤️VE with it. I love Dart and Flutter{' '}
                    <Link
                      href={
                        'https://dart.dev/guides/language/language-tour#generics'
                      }
                      target={'_blank'}
                    >
                      for
                    </Link>{' '}
                    <Link
                      href={'https://dart.dev/tutorials/language/streams'}
                      target={'_blank'}
                    >
                      so
                    </Link>{' '}
                    <Link
                      href={
                        'https://sites.google.com/site/dartlangexamples/learn/operators/operator-override'
                      }
                      target={'_blank'}
                    >
                      many
                    </Link>{' '}
                    <Link
                      href={'https://dart.dev/guides/language/concurrency'}
                      target={'_blank'}
                    >
                      reasons
                    </Link>{' '}
                    and also because it is{' '}
                    <Link
                      href={
                        'https://docs.flutter.dev/development/ui/layout/adaptive-responsive'
                      }
                      target={'_blank'}
                    >
                      platform adaptive
                    </Link>{' '}
                    and able to run on{' '}
                    <Link
                      href={
                        'https://docs.flutter.dev/development/tools/sdk/release-notes/supported-platforms'
                      }
                      target={'_blank'}
                    >
                      almost
                    </Link>{' '}
                    all the{' '}
                    <Link
                      href={'https://dart.dev/overview#platform'}
                      target={'_blank'}
                    >
                      platforms
                    </Link>
                    . And of course it is performant and 60fps because of
                    Flutter&apos;s{' '}
                    <Link
                      href={
                        'https://github.com/flutter/engine/tree/main/impeller'
                      }
                      target={'_blank'}
                    >
                      performant
                    </Link>{' '}
                    <Link
                      href={
                        'https://docs.flutter.dev/resources/architectural-overview'
                      }
                      target={'_blank'}
                    >
                      engine
                    </Link>{' '}
                    and{' '}
                    <Link href={'https://skia.org/'} target={'_blank'}>
                      Skia
                    </Link>
                    ! (I&apos;m looking at you{' '}
                    <Link href={'https://hermesengine.dev/'} target={'_blank'}>
                      Hermes
                    </Link>
                    )
                  </ListItem>
                  <ListItem>
                    I&apos;ve also got my hand on{' '}
                    <Link href='https://threejs.org/'>three.js</Link> for some
                    time now. I&apos;m really a noob at{' '}
                    <Link
                      href={'https://thebookofshaders.com/'}
                      target={'_blank'}
                    >
                      shaders
                    </Link>{' '}
                    but still learning about three.js lights, geometries,
                    materials, ray caster, etc. Three.js combined with{' '}
                    <Link
                      href={'https://github.com/pmndrs/react-three-fiber'}
                      target={'_blank'}
                    >
                      React components and hooks
                    </Link>{' '}
                    (e.g. useFrame,{' '}
                    <Link
                      href={'https://github.com/pmndrs/use-cannon'}
                      target={'_blank'}
                    >
                      useCanon
                    </Link>
                    ) creates a powerful foundation for 3D scene rendering.
                    (Think metaverse)
                  </ListItem>
                  <ListItem>
                    I use{' '}
                    <Link href='https://storybook.js.org/' target={'_blank'}>
                      Storybook
                    </Link>{' '}
                    for building components in isolation;{' '}
                    <Link href='https://www.cypress.io/' target={'_blank'}>
                      Cypress
                    </Link>{' '}
                    for e2e testing;{' '}
                    <Link
                      href={'https://testing-library.com/'}
                      target={'_blank'}
                    >
                      React testing library
                    </Link>{' '}
                    and{' '}
                    <Link href={'https://jestjs.io/'} target={'_blank'}>
                      Jest
                    </Link>{' '}
                    for unit and integration tests.
                  </ListItem>
                  <ListItem>
                    For CSS I’ve used a myriad pre-processors (Sass, Less,{' '}
                    <Link href='https://postcss.org/'>PostCSS</Link>), utilities
                    (tailwind, bootstrap,...), component libraries (
                    <Link href={'https://mui.com/'} target='_blank'>
                      material ui
                    </Link>
                    ,{' '}
                    <Link href={'https://chakra-ui.com/'} target='_blank'>
                      chakra-ui
                    </Link>
                    , <Link href={'https://semantic-ui.com/'}>semantic ui</Link>
                    ) and <span style={{whiteSpace: 'nowrap'}}>css-in-js</span>{' '}
                    solutions (
                    <Link href={'https://cssinjs.org/'} target={'_blank'}>
                      JSS
                    </Link>
                    ,{' '}
                    <Link href={'https://emotion.sh/'} target={'_blank'}>
                      emotion
                    </Link>
                    ,{' '}
                    <Link
                      href={'https://styled-components.com/'}
                      target='_blank'
                    >
                      styled components
                    </Link>
                    ) These days I like to use styled components wherever
                    possible and tailwind for a quick up and running.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding='none' className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width='m'>
              <ProjectSectionHeading>Design</ProjectSectionHeading>
              <ProjectSectionText as='div'>
                <List>
                  <ListItem>
                    I get designs in{' '}
                    <Link href={'https://figma.com'} target={'_blank'}>
                      Figma
                    </Link>{' '}
                    and that&apos;s my preferred vector/prototyping tool.
                  </ListItem>
                  <ListItem>
                    {' '}
                    For animating stuff on front end, I use{' '}
                    <Link href={'https://framer.com/motion'} target={'_blank'}>
                      Framer motion
                    </Link>{' '}
                    and{' '}
                    <Link href={'https://lottiefiles.com/'} target={'_blank'}>
                      LottieFiles
                    </Link>
                    .
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding='none' className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width='m'>
              <ProjectSectionHeading>Hardware</ProjectSectionHeading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeadCell>Monitor</TableHeadCell>
                    <TableCell>
                      2 *{' '}
                      <Link
                        href={
                          'https://www.lg.com/us/monitors/lg-22MP58VQ-P-led-monitor'
                        }
                        target={'_blank'}
                      >
                        Full HD IPS LED Monitor 60hz LG 22MP58VQ
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Keyboard</TableHeadCell>
                    <TableCell>
                      <Link
                        href={
                          'https://www.amazon.com/Mechanical-Keyboard-Keyboard-Switches-N-Rollover/dp/B08DVZFW91'
                        }
                        target={'_blank'}
                      >
                        Philips keyboard
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Mouse</TableHeadCell>
                    <TableCell>
                      <Link
                        href={
                          'https://www.apple.com/shop/product/MMMQ3AM/A/magic-mouse-black-multi-touch-surface'
                        }
                        target={'_blank'}
                      >
                        Apple Magic Mouse
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Laptop</TableHeadCell>
                    <TableCell>Macbook Pro 13″ (2020 M1)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Headphones</TableHeadCell>
                    <TableCell>
                      <Link
                        href={
                          'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm4-b'
                        }
                        target={'_blank'}
                      >
                        Sony WH-1000XM4
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Microphone</TableHeadCell>
                    <TableCell>Blue Yeti</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  )
}
