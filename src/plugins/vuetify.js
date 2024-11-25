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
    primary: '#ee62bf',    // Màu cam chủ đạo của TCH
    secondary: '#FEF7E6',  // Màu cam nhạt làm nền
    accent: '#B5313A',     // Màu đỏ accent
    
    // Các biến thể của màu chính
    'primary-darken-1': '#C66A1E',  // Cam đậm hơn
    'primary-lighten-1': '#FFA559',  // Cam nhạt hơn
    
    // Màu chữ
    'text-primary': '#000000DE',    // Chữ đen chính (87% opacity)
    'text-secondary': '#00000099',  // Chữ đen phụ (60% opacity)
    'text-disabled': '#00000061',   // Chữ bị disable (38% opacity)
    
    // Màu nền
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#F5F5F5',   // Màu nền phụ cho card, panel
    
    // Màu thông báo
    error: '#D32F2F',       // Đỏ lỗi
    info: '#0288D1',        // Xanh dương thông tin
    success: '#388E3C',     // Xanh lá thành công
    warning: '#F57C00',     // Cam cảnh báo
    
    // Màu border
    'border-color': '#0000001F'     // Màu viền (12% opacity)
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
