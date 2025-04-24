import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { OnboardingSlide } from '@/components/onboarding/OnboardingSlide';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface OnboardingContent {
  id: string;
  title: string;
  description: string;
  imageUrl: any;
}

const onboardingContent: OnboardingContent[] = [
  {
    id: 'welcome',
    title: 'All ability bowls',
    description: 'The application for tracking and managing your bowling games in real-time.',
    imageUrl: { uri: 'https://images.pexels.com/photos/4429422/pexels-photo-4429422.jpeg' },
  },
  {
    id: 'games',
    title: 'Join Live Games',
    description: 'Connect to games created by admins and track scores frame by frame.',
    imageUrl: { uri: 'https://images.pexels.com/photos/8827392/pexels-photo-8827392.jpeg' },
  },
  {
    id: 'scoring',
    title: 'Easy Score Tracking',
    description: 'Update your scores with a simple tap and see scores calculated automatically.',
    imageUrl: { uri: 'https://images.pexels.com/photos/344034/pexels-photo-344034.jpeg' },
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  const goToNextSlide = () => {
    if (activeIndex < onboardingContent.length - 1) {
      translateX.value = withTiming(-width * (activeIndex + 1), { duration: 500 });
      setActiveIndex(activeIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      translateX.value = withTiming(-width * (activeIndex - 1), { duration: 500 });
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    translateX.value = withTiming(-width * index, { duration: 500 });
    setActiveIndex(index);
  };

  const completeOnboarding = () => {
    router.replace('/(auth)/login');
  };

  const skipOnboarding = () => {
    router.replace('/(auth)/login');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={skipOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slidesContainer}>
        {onboardingContent.map((slide, index) => (
          <OnboardingSlide
            key={slide.id}
            title={slide.title}
            description={slide.description}
            image={slide.imageUrl}
            isActive={activeIndex === index}
          />
        ))}
      </View>

      <View style={styles.indicatorsContainer}>
        {onboardingContent.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        {activeIndex > 0 && (
          <Button
            title="Previous"
            onPress={goToPrevSlide}
            variant="outline"
            style={styles.button}
          />
        )}
        <Button
          title={activeIndex === onboardingContent.length - 1 ? "Get Started" : "Next"}
          onPress={goToNextSlide}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primary[500],
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.neutral[300],
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary[500],
    width: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});