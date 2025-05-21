import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '../constants/Theme';
import { isWeb } from '../constants/Colors';
import React from 'react';


interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof PADDING_VARIANTS | number;
}

const PADDING_VARIANTS = {
  none: 0,
  small: 8,
  medium: 16,
  large: 24,
};

export function Card({
  variant = 'elevated',
  style,
  padding = 'medium',
  children,
  ...props
}: CardProps) {
  const { colors, radius, shadows } = useTheme();

  const paddingValue = 
    typeof padding === 'number' 
      ? padding 
      : PADDING_VARIANTS[padding];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variant === 'outlined' ? 'transparent' : colors.card,
          borderRadius: radius.m,
          padding: paddingValue,
          ...(variant === 'elevated' && isWeb ? shadows.medium : {}),
          ...(variant === 'elevated' && !isWeb ? {
            shadowColor: colors.colors.gray[700],
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4.65,
            elevation: 6,
          } : {}),
          ...(variant === 'outlined' ? {
            borderWidth: 1,
            borderColor: colors.border,
          } : {}),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});