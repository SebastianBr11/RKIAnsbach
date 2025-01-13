import { StyleSheet } from 'react-native'

export const useStyle = () => {
  // For now set it do dark mode
  const isDark = () => {
    return true
  }

  const theColors = colors(isDark)
  return {
    isDark,
    colors: theColors,
    fontFamily,
    styles: styleSheet(theColors),
  }
}

export const fontFamily = {
  black: 'Inter-Black',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  thin: 'Inter-Thin',
}

export interface Colors {
  bg: string
  text: string
  text2: string
  text3: string
  text4: string
  primary100: string
  primary300: string
  primary500: string
  primary600: string
  tabBar: string
  tabBarText: string
  loader: {
    backgroundColor: string
    foregroundColor: string
  }
}

const colors = (isDark: () => boolean): Colors => ({
  bg: isDark() ? '#1F222F' : '#F9FAFB',
  text: isDark() ? '#E5E7EB' : '#4B5563',
  text2: '#9CA3AF',
  text3: isDark() ? '#F9FAFB' : '#1F2937',
  text4: isDark() ? '#F9FAFB' : '#6B7280',
  primary100: isDark() ? '#7F1D1D' : '#FEE2E2',
  primary300: isDark() ? '#B91C1C' : '#FCA5A5',
  primary500: '#EF4444',
  primary600: isDark() ? '#FECACA' : '#DC2626',
  tabBar: isDark() ? '#222835' : '#ffffff',
  tabBarText: isDark() ? '#1F2937' : '#F9FAFB',
  loader: {
    backgroundColor: isDark() ? '#242835' : '#f3f3f3',
    foregroundColor: isDark() ? '#383D55' : '#ecebeb',
  },
})

const styleSheet = (theColors: Colors) =>
  StyleSheet.create({
    scrollView: {
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 30,
      flex: 1,
      minHeight: 500,
    },
    switch: {},
    container: {
      flex: 1,
      backgroundColor: theColors.bg,
    },
    dateText: {
      fontFamily: fontFamily.medium,
      marginTop: 20,
      color: theColors.text2,
      textAlign: 'center',
    },
    boldText: {
      fontFamily: fontFamily.semiBold,
      color: theColors.primary500,
    },
    text: {
      fontFamily: fontFamily.regular,
      fontSize: 25,
      color: theColors.text,
      textAlign: 'center',
    },
    header: {
      color: theColors.text3,
      fontFamily: fontFamily.semiBold,
      fontSize: 35,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theColors.primary100,
      paddingHorizontal: 30,
      paddingVertical: 20,
      borderColor: theColors.primary300,
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonText: {
      color: theColors.primary600,
      fontFamily: fontFamily.light,
      fontSize: 20,
    },
    marginTop20: {
      marginTop: 20,
    },
    marginTop30: {
      marginTop: 30,
    },
    marginTop40: {
      marginTop: 40,
    },
  })
