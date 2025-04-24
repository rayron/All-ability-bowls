import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy } from 'lucide-react-native';

import { GameCard } from '@/components/games/GameCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Game } from '@/types/game';
import { api } from '@/utils/api';

export default function GamesScreen() {
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Live Games</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
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

    return (
      <Card style={styles.emptyContainer}>
        <Trophy size={48} color={COLORS.neutral[400]} />
        <Text style={styles.emptyText}>No active games found</Text>
        <Text style={styles.emptySubtext}>
          Check back later or ask an admin to create a new game.
        </Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameCard game={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.l,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.neutral[800],
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
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
});