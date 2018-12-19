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
  components: {
    Button: {
      default: {
        borderColor: colors.yellow,
        titleColor: colors.yellow,

        backgroundHoverColor: colors.yellow,
        borderHoverColor: colors.yellow,
        titleHoverColor: colors.white,
      },
      yellow: {
        backgroundColor: colors.yellow,
        borderColor: colors.yellow,
        titleColor: colors.black,

        titleHoverColor: colors.white,
      },
    },
  },
  native: {
    ...colors,
    spacing: '20px',
  },
}
