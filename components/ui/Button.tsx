import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};

    // Base styles for all variants
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: COLORS.primary[500],
          borderWidth: 0,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: COLORS.secondary[500],
          borderWidth: 0,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary[500],
        };
        break;
      case 'ghost':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        break;
      default:
        buttonStyle = {
          backgroundColor: COLORS.primary[500],
          borderWidth: 0,
        };
    }

    // Apply size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.m,
          borderRadius: BORDER_RADIUS.s,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.s,
          paddingHorizontal: SPACING.l,
          borderRadius: BORDER_RADIUS.m,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.m,
          paddingHorizontal: SPACING.xl,
          borderRadius: BORDER_RADIUS.l,
        };
        break;
      default:
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.s,
          paddingHorizontal: SPACING.l,
          borderRadius: BORDER_RADIUS.m,
        };
    }

    // Apply disabled styles
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.5,
      };
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let style: TextStyle = {
      fontFamily: FONTS.medium,
      textAlign: 'center',
    };

    // Base text styles for all variants
    switch (variant) {
      case 'primary':
      case 'secondary':
        style = {
          ...style,
          color: COLORS.white,
        };
        break;
      case 'outline':
      case 'ghost':
        style = {
          ...style,
          color: COLORS.primary[500],
        };
        break;
      default:
        style = {
          ...style,
          color: COLORS.white,
        };
    }

    // Apply size styles
    switch (size) {
      case 'small':
        style = {
          ...style,
          fontSize: 14,
        };
        break;
      case 'medium':
        style = {
          ...style,
          fontSize: 16,
        };
        break;
      case 'large':
        style = {
          ...style,
          fontSize: 18,
        };
        break;
      default:
        style = {
          ...style,
          fontSize: 16,
        };
    }

    return style;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? COLORS.white : COLORS.primary[500]}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), textStyle, leftIcon || rightIcon ? styles.textWithIcon : null]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWithIcon: {
    marginHorizontal: SPACING.xs,
  },
});