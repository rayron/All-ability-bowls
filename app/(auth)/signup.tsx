import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthForm } from '@/components/auth/AuthForm';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.logo}>BowlTracker</Text>
            <Text style={styles.tagline}>Score your way to victory</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/344034/pexels-photo-344034.jpeg' }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Sign up to start tracking your bowling games</Text>
            
            <AuthForm type="signup" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.primary[500],
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.neutral[800],
    marginBottom: SPACING.xs,
  },
  formSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.neutral[600],
    marginBottom: SPACING.xl,
  },
});