import {themes} from '@storybook/theming'
import {addons} from '@storybook/addons'

addons.setConfig({
  theme: {
    ...themes.dark,
    brandImage: 'https://mehrdad.ai/icon.svg',
    brandTitle: 'Mehrdad Shokri Components',
    brandUrl: 'https://mehrdad.ai',
  },
})
