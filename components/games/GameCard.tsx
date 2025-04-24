import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Users } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const router = useRouter();

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

  const handlePress = () => {
    router.push(`/(tabs)/games/${game.id}`);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Card style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{game.name}</Text>
          {game.isActive && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Live</Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin color={COLORS.neutral[500]} size={16} />
            <Text style={styles.infoText}>{game.location}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar color={COLORS.neutral[500]} size={16} />
            <Text style={styles.infoText}>{formatDate(game.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Users color={COLORS.neutral[500]} size={16} />
            <Text style={styles.infoText}>{game.players.length} players</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          {game.players.map((player, index) => (
            <View key={player.id} style={styles.playerContainer}>
              <Text style={styles.playerName} numberOfLines={1}>
                {player.name}
              </Text>
              <Text style={styles.playerScore}>
                {player.totalScore > 0 ? player.totalScore : '-'}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
  },
  activeIndicator: {
    backgroundColor: COLORS.success[100],
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.success[700],
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
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
    marginLeft: 4,
  },
  statusContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingTop: SPACING.s,
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  playerName: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.neutral[700],
    flex: 1,
  },
  playerScore: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.primary[600],
    marginLeft: SPACING.s,
  },
});