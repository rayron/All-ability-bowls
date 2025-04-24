import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, User, Award } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{user?.username || 'User'}</Text>
              <View style={styles.emailContainer}>
                <Mail size={14} color={COLORS.neutral[500]} />
                <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>
          </View>

          <Button
            title="Edit Profile"
            variant="outline"
            style={styles.editButton}
          />
        </Card>

        <Text style={styles.sectionTitle}>Bowling Statistics</Text>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
          </View>
          
          <View style={styles.statsSeparator} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>High Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Strikes</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Recent Achievements</Text>

        <Card style={styles.emptyCard}>
          <Award size={40} color={COLORS.neutral[400]} />
          <Text style={styles.emptyText}>No achievements yet</Text>
          <Text style={styles.emptySubtext}>
            Play more games to unlock achievements
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.m,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.neutral[800],
    marginBottom: SPACING.l,
  },
  profileCard: {
    marginBottom: SPACING.l,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary[700],
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[600],
    marginLeft: 6,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
    marginBottom: SPACING.s,
  },
  statsCard: {
    marginBottom: SPACING.l,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.s,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary[500],
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[600],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.neutral[200],
  },
  statsSeparator: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING.s,
  },
  emptyCard: {
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.neutral[700],
    marginTop: SPACING.s,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
});