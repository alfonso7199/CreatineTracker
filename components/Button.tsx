import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
    TouchableOpacityProps,
    Platform,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../constants/Theme';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'contained' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
    textColor?: string;
    uppercase?: boolean;
    disabled?: boolean;
    disableElevation?: boolean;
}

export function Button({
    variant = 'contained',
    size = 'medium',
    style,
    children,
    startIcon,
    endIcon,
    fullWidth = false,
    loading = false,
    color = 'primary',
    textColor,
    uppercase = true,
    disabled = false,
    disableElevation = false,
    ...props
}: ButtonProps) {
    const { colors, spacing, radius } = useTheme();

    const getBackgroundColor = () => {
        if (variant === 'contained') {
            return colors[color];
        }
        return 'transparent';
    };

    const getTextColor = () => {
        if (textColor) return textColor;

        if (variant === 'contained') {
            return colors.colors.white;
        }
        return colors[color];
    };

    const getBorderColor = () => {
        if (variant === 'outlined') {
            return colors[color];
        }
        return 'transparent';
    };

    const getPadding = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: spacing.xs, paddingHorizontal: spacing.m };
            case 'large':
                return { paddingVertical: spacing.m, paddingHorizontal: spacing.xl };
            default:
                return { paddingVertical: spacing.s, paddingHorizontal: spacing.l };
        }
    };

    const elevationStyles = (variant === 'contained' && !disableElevation && Platform.OS !== 'web') ? {
        shadowColor: colors.colors.gray[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    } : {};

    const buttonStyles: StyleProp<ViewStyle> = [
        styles.button,
        {
            backgroundColor: disabled ? colors.colors.gray[300] : getBackgroundColor(),
            borderColor: disabled ? colors.colors.gray[300] : getBorderColor(),
            borderWidth: variant === 'outlined' ? 1 : 0,
            borderRadius: size === 'small' ? radius.s : size === 'large' ? radius.l : radius.m,
            opacity: disabled ? 0.7 : 1,
            ...getPadding(),
            ...(fullWidth ? { width: '100%' } : {}),
            ...elevationStyles,
        },
        style,
    ];

    const getFontSize = () => {
        switch (size) {
            case 'small': return 'caption';
            case 'large': return 'subtitle2';
            default: return 'button';
        }
    };

    return (
        <TouchableOpacity
            style={buttonStyles}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            <View style={styles.contentContainer}>
                {startIcon && !loading && (
                    <View style={styles.iconStart}>{startIcon}</View>
                )}

                {loading ? (
                    <ActivityIndicator
                        color={getTextColor()}
                        size={size === 'small' ? 'small' : 'small'}
                    />
                ) : (
                    <Typography
                        variant={getFontSize()}
                        color={disabled ? colors.colors.gray[500] : getTextColor()}
                        style={uppercase ? { textTransform: 'uppercase' } : {}}
                    >
                        {children}
                    </Typography>
                )}

                {endIcon && !loading && (
                    <View style={styles.iconEnd}>{endIcon}</View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStart: {
        marginRight: 8,
    },
    iconEnd: {
        marginLeft: 8,
    },
});