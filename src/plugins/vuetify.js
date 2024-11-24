/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const COFFEE_HOUSE_THEME = {
  dark: false,
  colors: {
    primary: '#EA8025', // Màu cam chủ đạo của TCH
    secondary: '#FEF7E6', // Màu cam nhạt
    accent: '#B5313A', // Màu đỏ accent
    'primary-darken-1': '#C66A1E',
    'text-primary': '#000000DE',
    'text-secondary': '#00000099',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: COFFEE_HOUSE_THEME
    }
  }
})
