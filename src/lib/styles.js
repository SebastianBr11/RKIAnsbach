import { StyleSheet } from 'react-native';

export const useStyle = colorScheme => {
  const isDark = () => {
    return colorScheme === 'dark';
  };

  const theColors = colors(isDark);

  return [isDark, theColors, fontFamily, styleSheet(theColors)];
};

const fontFamily = {
  black: 'Inter-Black',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  thin: 'Inter-Thin',
};

const colors = isDark => ({
  bg: isDark() ? '#1F222F' : '#F9FAFB',
  text: isDark() ? '#E5E7EB' : '#4B5563',
  text2: '#9CA3AF',
  text3: isDark() ? '#F9FAFB' : '#1F2937',
  primary100: isDark() ? '#7F1D1D' : '#FEE2E2',
  primary300: isDark() ? '#B91C1C' : '#FCA5A5',
  primary500: '#EF4444',
  primary600: isDark() ? '#FECACA' : '#DC2626',
  tabBar: isDark() ? '#222835' : '#ffffff',
});

const styleSheet = theColors =>
  StyleSheet.create({
    scrollView: {
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 30,
      flex: 1,
      minHeight: 600,
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
  });
