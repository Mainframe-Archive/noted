const colors = {
  white: '#fff',
  lightYellow: '#fcecb0',
  yellow: '#FFD953',
  darkYellow: '#E5B711',
  blue: '#1f3464',
  lightBlue: '#00a7e7',
  red: '#da1157',
  lightGray: '#f7f7f7',
  gray: '#f1f1f1',
  mediumGray: '#B5B5B5',
  darkGray: '#232323',
  error: '#E51111',
}

export default {
  Button: {
    default: {
      backgroundColor: 'transparent',
      borderColor: colors.yellow,
      titleColor: colors.yellow,

      backgroundHoverColor: colors.yellow,
      borderHoverColor: colors.yellow,
      titleHoverColor: colors.white,
    },
    borderless: {
      backgroundColor: colors.white,
      borderColor: colors.white,
      titleColor: colors.black,

      letterSpacing: '1.5px',
      fontSize: '11px',

      backgroundHoverColor: colors.white,
      borderHoverColor: 'transparent',
      titleHoverColor: colors.black,
      hoverShadow: true,
    },
    grayIcon: {
      iconBackgroundColor: 'transparent',
      borderColor: colors.mediumGray,
      titleColor: colors.mediumGray,
      iconColor: colors.mediumGray,
      titlePadding: 0,

      iconHoverBackgroundColor: 'transparent',
      backgroundHoverColor: 'transparent',
      borderHoverColor: 'transparent',
      hoverShadow: true,
      iconHoverColor: colors.mediumGray,

      iconHeight: 12,
      iconWidth: 12,
    },
    darkYellow: {
      backgroundColor: colors.yellow,
      iconBackgroundColor: colors.yellow,
      borderColor: colors.yellow,
      titleColor: colors.black,
      iconColor: colors.black,
      letterSpacing: '1px',
      fontSize: '11px',

      backgroundHoverColor: colors.darkYellow,
      iconHoverBackgroundColor: colors.darkYellow,
      borderHoverColor: colors.darkYellow,
      iconHoverColor: colors.black,
      titleHoverColor: colors.black,

      iconHeight: 12,
      iconWidth: 12,
    },
    icon: {
      iconHoverBackgroundColor: 'transparent',
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
      backgroundHoverColor: 'transparent',
      iconHoverColor: colors.yellow,
    },
    invisible: {
      iconHoverBackgroundColor: 'transparent',
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
      backgroundHoverColor: 'transparent',
      iconHoverColor: 'transparent',
      iconColor: 'transparent',
    },
    short: {
      titlePadding: '6px',
    },
    whiteClose: {
      iconColor: colors.white,
      iconHoverColor: colors.white,
      iconBackgroundColor: 'transparent',
      iconHoverBackgroundColor: 'transparent',
      iconHeight: '12px',
      iconWidth: '12px',
      backgroundHoverColor: 'transparent',
      hoverShadow: false,
    },
  },
  Text: {
    default: {
      color: colors.darkGray,
    },
    title: {
      fontWeight: 'bold',
    },
    faded: {
      color: colors.mediumGray,
    },
    date: {
      color: colors.mediumGray,
      fontSize: '12px',
    },
    smaller: {
      fontSize: '12px',
    },
    folder: {
      lineHeight: '10px',
    },
  },
  TextField: {
    default: {
      textActiveColor: colors.black,
    },
    large: {
      fontSize: '35px',
      backgroundColor: colors.white,
    },
    folderText: {
      color: colors.mediumGray,
      fontSize: '15px',
    },
    selectedFolderText: {
      color: colors.black,
      fontWeight: 'bold',
      labelColor: colors.black,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
}
