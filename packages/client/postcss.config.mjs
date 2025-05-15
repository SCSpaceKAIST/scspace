// client/postcss.config.mjs
import tailwindPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

/** @type {import('postcss').ProcessOptions} */
export default {
  plugins: {
    // use the new PostCSS plugin package
    '@tailwindcss/postcss': {},
    // vendor prefixes
    autoprefixer: {},
  },
}

