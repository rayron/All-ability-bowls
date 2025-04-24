import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Trophy } from 'lucide-react-native';

import { GameCard } from '@/components/games/GameCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Game } from '@/types/game';
import { api } from '@/utils/api';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setError(null);
      const data = await api.games.getAll();
      setGames(data);
    } catch (err) {
      setError('Failed to load games. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGames();
  };

  const handleViewAllGames = () => {
    router.push('/(tabs)/games');
  };

  const renderGames = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={fetchGames}
            variant="outline"
            style={styles.errorButton}
          />
        </View>
      );
    }

    if (games.length === 0) {
      return (
        <Card style={styles.emptyContainer}>
          <Trophy size={48} color={COLORS.neutral[400]} />
          <Text style={styles.emptyText}>No active games found</Text>
          <Text style={styles.emptySubtext}>
            Check back later or ask an admin to create a new game.
          </Text>
        </Card>
      );
    }

    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Games</Text>
          <Button
            title="View All"
            onPress={handleViewAllGames}
            variant="ghost"
            size="small"
          />
        </View>

        {games.slice(0, 3).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.username || 'Bowler'}</Text>
          </View>
        </View>

        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Bowling Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>High Score</Text>
            </View>
          </View>
        </Card>

        {renderGames()}
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
  },
  contentContainer: {
    padding: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  welcomeText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.neutral[600],
  },
  nameText: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.neutral[800],
  },
  statsCard: {
    marginBottom: SPACING.l,
  },
  statsTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.neutral[700],
    marginBottom: SPACING.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
  },
  loadingContainer: {
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.error[600],
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  errorButton: {
    minWidth: 120,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[700],
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
});