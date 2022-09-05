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
          description="A somewhat comprehensive list of tools, apps, software, hardware, and more that I use on a daily basis to get shit done. Over periods of time, people grow their own unique taste in tech and here's mine; so please, take it with a grain of salt.  And yeah, that is Johnny Mnemonic in the background."
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
                    Chrome is my main browser for both development and general
                    use. But I make sure my front end code is running smoothly
                    on both{' '}
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
                    I&apos;ve seen surprising bugs related to CSS display
                    behaving differently in Safari or scroll area scrolling by
                    itself after adding an element as child so I had to reset
                    scroll index by a React ref!
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
                    of choice. Since I learnt it back in{' '}
                    <Link
                      href={
                        'https://github.com/mehrdad-shokri/ashojash-web/blob/master/resources/assets/js/src/components/hoc/Panel.jsx'
                      }
                      target={'_blank'}
                    >
                      2015
                    </Link>
                    ; I&apos;ve never looked back for another front end
                    framework because of it&apos;s reactive state model and
                    component mental model and lately, it&apos;s hook mental
                    model which all are really powerful. Before that I&apos;ve
                    used KnockoutJS, BackboneJs and of course JQuery! I might
                    give some of these new kids a try; the most prominent one
                    under my radar;{' '}
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
                    Linux servers(CentOS), setting up firewalls, systemd, mysql
                    on the server and running services on Docker and Docker
                    Compose; I&apos;ve decided to put all my eggs on{' '}
                    <Link href={'https://aws.amazon.com/'} target={'_blank'}>
                      AWS
                    </Link>{' '}
                    and never think of infrastructure maintenance again. (Yeah
                    shut up and take my money) I&apos;m now a servile of AWS and
                    services like Lambda, Amplify, AppSync, API Gateways,
                    DynamoDB, Cognito, VPC, SQS, SNS, S3 and others!
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
                    applications deployed as lambda functions + and integrated
                    with other AWS services like lambda triggers, SQS, Amplify,
                    DynamoDB as my backend.
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
                    on web and overall not feeling native to me overall) so gave{' '}
                    <Link href={'https://flutter.dev/'} target={'_blank'}>
                      Flutter
                    </Link>{' '}
                    a try and fell in L❤️VE with it. I both love Dart
                    programming language{' '}
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
                    and Flutter for being platform adaptive and being able to
                    run on almost all platforms, natively! Well, almost natively
                    but it may seem 100% native due to Flutter&apos;s performant{' '}
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
                    (e.g., useFrame) creates a powerful foundation for 3D scene
                    rendering. (Think metaverse)
                  </ListItem>
                  <ListItem>
                    For building UI components in isolation I use{' '}
                    <Link href='https://storybook.js.org/' target={'_blank'}>
                      Storybook
                    </Link>
                    . For e2e testing I use{' '}
                    <Link href='https://www.cypress.io/' target={'_blank'}>
                      Cypress
                    </Link>
                    . For unit and integration tests I use{' '}
                    <Link
                      href={'https://testing-library.com/'}
                      target={'_blank'}
                    >
                      React testing library
                    </Link>{' '}
                    and{' '}
                    <Link href={'https://jestjs.io/'} target={'_blank'}>
                      Jest
                    </Link>
                    .
                  </ListItem>
                  <ListItem>
                    For CSS I’ve used a myriad pre-processors (Sass, Less,{' '}
                    <Link href='https://postcss.org/'>PostCSS</Link>), utilities
                    (tailwind, bootstrap, classnames,...), component libraries (
                    <Link href={'https://mui.com/'} target='_blank'>
                      material ui
                    </Link>
                    ,{' '}
                    <Link href={'https://chakra-ui.com/'} target='_blank'>
                      chakra-ui
                    </Link>
                    , <Link href={'https://semantic-ui.com/'}>semantic ui</Link>
                    ), <span style={{whiteSpace: 'nowrap'}}>
                      css-in-js
                    </span>{' '}
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
                    ), etc. These days I like to use styled components wherever
                    possible and tailwind for a quick up and running.
                  </ListItem>
                  <ListItem>
                    I get designs in{' '}
                    <Link href={'https://figma.com'} target={'_blank'}>
                      Figma
                    </Link>{' '}
                    and that&apos;s my preferred vector/prototyping editor.
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
                    <Link href='https://www.figma.com'>Figma</Link> is my
                    primary tool for UI design these days. Made the switch from
                    Sketch in 2020 and haven’t looked back. I’ve also created{' '}
                    <Link href='https://www.figma.com/@hamish'>
                      a few plugins
                    </Link>{' '}
                    that you can install.
                  </ListItem>
                  <ListItem>
                    Any motion graphics I create are created in Adobe After
                    Effects. So far I haven’t found a non-Adobe product that’s
                    as good. If anyone has suggestions please{' '}
                    <Link href='/contact'>message me</Link>.
                  </ListItem>
                  <ListItem>
                    For any 3D models I use{' '}
                    <Link href='https://www.blender.org/'>Blender</Link>. Since
                    2.8 it’s become way simpler to use and in a lot of ways
                    better than expensive paid tools like 3DS Max or Maya.
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
                    <TableHeadCell>CPU</TableHeadCell>
                    <TableCell>AMD Ryzen 5800x</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>GPU</TableHeadCell>
                    <TableCell>MSI Gaming X Trio RTX 3080</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Memory</TableHeadCell>
                    <TableCell>GSkill 32GB DDR4 3600mhz CAS 18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Motherboard</TableHeadCell>
                    <TableCell>MSI B550 Tomahawk</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Monitor</TableHeadCell>
                    <TableCell>1440p IPS 144hz LG 27GL850</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Keyboard</TableHeadCell>
                    <TableCell>Logitech MX Keys</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Mouse</TableHeadCell>
                    <TableCell>Logitech G403</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Laptop</TableHeadCell>
                    <TableCell>Macbook Pro 14″ (2022 M1 Max)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Headphones</TableHeadCell>
                    <TableCell>Audio Technica ATH-M50x/Apple Airpods</TableCell>
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
