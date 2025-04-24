import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'medium',
  padding = 'medium',
}) => {
  const getShadowStyle = () => {
    switch (elevation) {
      case 'small':
        return SHADOWS.small;
      case 'medium':
        return SHADOWS.medium;
      case 'large':
        return SHADOWS.large;
      default:
        return SHADOWS.medium;
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return SPACING.s;
      case 'medium':
        return SPACING.m;
      case 'large':
        return SPACING.l;
      default:
        return SPACING.m;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getShadowStyle(),
        { padding: getPaddingStyle() },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
  },
});