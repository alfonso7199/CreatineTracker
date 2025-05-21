/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Modern color scheme
const palette = {
  // Primary colors
  primary: {
    50: '#E6F1FF',
    100: '#CCE4FF',
    200: '#99C9FF',
    300: '#66ADFF',
    400: '#3392FF',
    500: '#0077FF', // Main primary color
    600: '#005FCC',
    700: '#004799',
    800: '#003066',
    900: '#001833',
  },
  // Secondary colors
  secondary: {
    50: '#E6FAF5',
    100: '#CCF5EB',
    200: '#99EBD6',
    300: '#66E0C2',
    400: '#33D6AD',
    500: '#00CC99', // Main secondary color
    600: '#00A37A',
    700: '#007A5C',
    800: '#00523D',
    900: '#00291F',
  },
  // Accent colors
  accent: {
    50: '#FFF3E6',
    100: '#FFE6CC',
    200: '#FFCD99',
    300: '#FFB466',
    400: '#FF9B33',
    500: '#FF8200', // Main accent color
    600: '#CC6800',
    700: '#994E00',
    800: '#663400',
    900: '#331A00',
  },
  // Success colors
  success: {
    50: '#E7F9E7',
    100: '#D0F4D0',
    200: '#A1E9A1',
    300: '#72DE72',
    400: '#43D343',
    500: '#14C814', // Main success color
    600: '#10A010',
    700: '#0C780C',
    800: '#085008',
    900: '#042804',
  },
  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
};

export default {
  light: {
    background: palette.white,
    surface: palette.gray[50],
    card: palette.white,
    text: palette.gray[900],
    textSecondary: palette.gray[600],
    border: palette.gray[200],
    primary: palette.primary[500],
    primaryLight: palette.primary[100],
    secondary: palette.secondary[500],
    accent: palette.accent[500],
    success: palette.success[500],
    error: '#E53E3E',
    warning: '#F59E0B',
    info: palette.primary[400],
    colors: palette,
    white: palette.white,
    black: palette.black,
  },
  dark: {
    background: palette.gray[900],
    surface: palette.gray[800],
    card: palette.gray[800],
    text: palette.gray[100],
    textSecondary: palette.gray[400],
    border: palette.gray[700],
    primary: palette.primary[400],
    primaryLight: palette.primary[900],
    secondary: palette.secondary[400],
    accent: palette.accent[400],
    success: palette.success[400],
    error: '#FC8181',
    warning: '#FBD38D',
    info: palette.primary[300],
    colors: palette,
    white: palette.white,
    black: palette.black,
  },
};

export const isWeb = Platform.OS === 'web';