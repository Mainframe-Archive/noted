const colors = {
  white: '#fff',
  lightYellow: '#fcecb0',
  yellow: '#FFD953',
  blue: '#1f3464',
  lightBlue: '#00a7e7',
  red: '#da1157',
  lightGray: '#f7f7f7',
  gray: '#f1f1f1',
  mediumGray: '#B5B5B5',
  darkGray: '#232323',
}

export default {
  Button: {
    default: {
      backgroundColor: colors.lightBlue,
      borderColor: colors.lightBlue,
      titleColor: colors.white,

      backgroundHoverColor: colors.white,
      borderHoverColor: colors.white,
      titleHoverColor: colors.darkGray,
    },
    yellow: {
      backgroundColor: colors.yellow,
      borderColor: colors.yellow,
      titleColor: colors.black,

      titleHoverColor: colors.white,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
}
