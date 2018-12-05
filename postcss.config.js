module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false
    },
    'autoprefixer': 'last 2 versions',
    'cssnano': {
      preset: 'advanced',
      autoprefixer: false,
      "postcss-zindex": false
    },
  }
};