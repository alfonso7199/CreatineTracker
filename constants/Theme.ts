import { useColorScheme } from 'react-native';
import Colors from './Colors';

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const useTheme = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return {
    colors: Colors[colorScheme],
    spacing: SPACING,
    radius: RADIUS,
    shadows: SHADOWS,
    colorScheme,
  };
};

export const ANIMATION_CONFIG = {
  timing: {
    default: 300,
    fast: 200,
    slow: 500,
  },
  spring: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
};