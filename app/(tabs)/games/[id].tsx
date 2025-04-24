import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react-native';

import { ScoreCard } from '@/components/games/ScoreCard';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Game } from '@/types/game';
import { api } from '@/utils/api';
import { updatePlayerScore } from '@/utils/scoring';

export default function GameDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = async () => {
    if (!id) return;
    
    try {
      setError(null);
      const data = await api.games.getById(id as string);
      setGame(data);
    } catch (err) {
      setError('Failed to load game details. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [id]);

  const handleUpdateScore = async (playerId: string, frameIndex: number, rollIndex: 1 | 2 | 3, pins: number) => {
    if (!game) return;
    
    // Find the player and update their score locally first
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    const updatedPlayer = updatePlayerScore(
      game.players[playerIndex],
      frameIndex,
      rollIndex,
      pins
    );
    
    // Update the game state with the new player data
    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = updatedPlayer;
    
    setGame({
      ...game,
      players: updatedPlayers,
    });
    
    // Also update on the server
    try {
      await api.games.updateScore(game.id, playerId, frameIndex + 1, rollIndex, pins);
    } catch (error) {
      console.error('Failed to update score on server:', error);
      // You might want to show an error toast or revert the local change
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !game) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.neutral[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Game not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchGame}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.neutral[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameTitle}>{game.name}</Text>
          {game.isActive && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin color={COLORS.neutral[500]} size={18} />
            <Text style={styles.infoText}>{game.location}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar color={COLORS.neutral[500]} size={18} />
            <Text style={styles.infoText}>{formatDate(game.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Users color={COLORS.neutral[500]} size={18} />
            <Text style={styles.infoText}>{game.players.length} players</Text>
          </View>
        </View>

        <Text style={styles.scorecardsTitle}>Scorecards</Text>

        {game.players.map((player) => (
          <ScoreCard
            key={player.id}
            player={player}
            onUpdateScore={handleUpdateScore}
            isEditable={game.isActive}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.error[600],
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  retryButton: {
    backgroundColor: COLORS.primary[500],
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
  },
  container: {
    flex: 1,
    padding: SPACING.m,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  gameTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.neutral[800],
  },
  liveIndicator: {
    backgroundColor: COLORS.success[100],
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.success[700],
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.l,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.m,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[600],
    marginLeft: 6,
  },
  scorecardsTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
    marginBottom: SPACING.m,
  },
});