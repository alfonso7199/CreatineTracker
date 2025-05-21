import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../constants/Theme';
import React from 'react';
type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'overline';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    numberOfLines?: number;
}

export function Typography({
    variant = 'body1',
    style,
    color,
    align,
    children,
    fontFamily,
    bold = false,
    italic = false,
    numberOfLines,
    ...props
}: TypographyProps) {
    const { colors } = useTheme();

    const textColor = color || colors.text;

    const dynamicStyle: TextStyle = {
        color: textColor,
        textAlign: align,
        fontStyle: italic ? 'italic' : 'normal',
    };

    if (bold) dynamicStyle.fontWeight = 'bold';
    if (fontFamily) dynamicStyle.fontFamily = fontFamily;

    const combinedStyle: StyleProp<TextStyle> = [
        styles.base,
        styles[variant],
        dynamicStyle,
        style,
    ].filter(Boolean);
    return (
        <Text style={combinedStyle} numberOfLines={numberOfLines} {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        fontFamily: 'Montserrat_400Regular',
    },
    h1: {
        fontFamily: 'JosefinSans_700Bold',
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontFamily: 'JosefinSans_700Bold',
        fontSize: 28,
        lineHeight: 36,
    },
    h3: {
        fontFamily: 'JosefinSans_600SemiBold',
        fontSize: 24,
        lineHeight: 32,
    },
    h4: {
        fontFamily: 'JosefinSans_600SemiBold',
        fontSize: 20,
        lineHeight: 28,
    },
    subtitle1: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 18,
        lineHeight: 24,
    },
    subtitle2: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        lineHeight: 22,
    },
    body1: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 16,
        lineHeight: 24,
    },
    body2: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    button: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
        textTransform: 'uppercase',
    },
    caption: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
    },
    overline: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 10,
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});