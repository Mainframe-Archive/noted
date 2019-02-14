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
      backgroundColor: 'transparent',
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
    borderless: {
      backgroundColor: colors.white,
      borderColor: colors.white,
      titleColor: colors.black,

      letterSpacing: '1.5px',
      fontSize: '11px',

      backgroundHoverColor: colors.white,
      borderHoverColor: colors.yellow,
      titleHoverColor: colors.yellow,
    },
    grayIcon: {
      iconBackgroundColor: 'transparent',
      borderColor: colors.mediumGray,
      titleColor: colors.mediumGray,
      iconColor: colors.mediumGray,
      titlePadding: 0,

      iconHoverBackgroundColor: 'transparent',
      backgroundHoverColor: 'transparent',
      borderHoverColor: colors.yellow,
      iconHoverColor: colors.yellow,

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

      iconHoverBackgroundColor: colors.yellow,
      borderHoverColor: colors.yellow,
      iconHoverColor: colors.white,
      titleHoverColor: colors.white,

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
    short: {
      titlePadding: '6px',
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
  },
  TextField: {
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
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
}
