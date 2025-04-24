import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Player } from '@/types/game';
import { formatFrameScore } from '@/utils/scoring';

interface ScoreCardProps {
  player: Player;
  onUpdateScore: (playerId: string, frameIndex: number, rollIndex: 1 | 2 | 3, pins: number) => void;
  isEditable: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  player,
  onUpdateScore,
  isEditable,
}) => {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [selectedRoll, setSelectedRoll] = useState<1 | 2 | 3 | null>(null);

  const handleFrameSelect = (frameIndex: number) => {
    // Find the next available roll in this frame
    const frame = player.frames[frameIndex];
    
    let nextRoll: 1 | 2 | 3 | null = null;
    
    if (frame.roll1 === null) {
      nextRoll = 1;
    } else if (frame.roll2 === null && (frameIndex < 9 || !frame.isStrike)) {
      nextRoll = 2;
    } else if (frameIndex === 9 && (frame.isStrike || frame.isSpare) && frame.roll3 === null) {
      nextRoll = 3;
    }
    
    if (nextRoll !== null) {
      setSelectedFrame(frameIndex);
      setSelectedRoll(nextRoll);
    }
  };

  const handlePinSelect = (pins: number) => {
    if (selectedFrame === null || selectedRoll === null) return;
    
    // Validate roll is valid for current frame state
    const frame = player.frames[selectedFrame];
    
    // For second roll in a normal frame, ensure total pins doesn't exceed 10
    if (selectedRoll === 2 && selectedFrame < 9 && frame.roll1 !== null) {
      const maxPins = 10 - frame.roll1;
      if (pins > maxPins) return;
    }
    
    // For 10th frame second roll after a strike, no validation needed
    // For 10th frame third roll after a strike+strike, no validation needed
    // For 10th frame third roll after a spare, no validation needed
    
    // Update the score
    onUpdateScore(player.id, selectedFrame, selectedRoll, pins);
    
    // Reset selection
    setSelectedFrame(null);
    setSelectedRoll(null);
  };

  const renderPinButtons = () => {
    const buttons = [];
    let maxPins = 10;
    
    // For second roll in a normal frame, max pins is 10 - first roll
    if (selectedFrame !== null && selectedRoll === 2 && selectedFrame < 9 && player.frames[selectedFrame].roll1 !== null) {
      maxPins = 10 - player.frames[selectedFrame].roll1;
    }
    
    for (let i = 0; i <= maxPins; i++) {
      buttons.push(
        <Button
          key={i}
          title={i === 10 ? 'X' : i.toString()}
          onPress={() => handlePinSelect(i)}
          variant="outline"
          size="small"
          style={styles.pinButton}
        />
      );
    }
    
    return (
      <View style={styles.pinSelection}>
        <Text style={styles.pinSelectionTitle}>
          {`Select pins for Frame ${selectedFrame !== null ? selectedFrame + 1 : ''} Roll ${selectedRoll || ''}`}
        </Text>
        <View style={styles.pinButtonsContainer}>
          {buttons}
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.playerName}>{player.name}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.framesContainer}>
          {/* Frame Headers */}
          <View style={styles.frameHeaderRow}>
            {player.frames.map((frame, index) => (
              <View 
                key={`header-${index}`} 
                style={[
                  styles.frameHeader, 
                  index === 9 ? styles.lastFrameHeader : null
                ]}
              >
                <Text style={styles.frameHeaderText}>{index + 1}</Text>
              </View>
            ))}
          </View>
          
          {/* Frame Scores */}
          <View style={styles.frameScoresRow}>
            {player.frames.map((frame, index) => (
              <View 
                key={`score-${index}`} 
                style={[
                  styles.frameScore,
                  index === 9 ? styles.lastFrameScore : null,
                  index === selectedFrame ? styles.selectedFrame : null,
                  isEditable ? styles.clickableFrame : null,
                ]}
                onTouchEnd={isEditable ? () => handleFrameSelect(index) : undefined}
              >
                <Text style={styles.frameScoreText}>
                  {formatFrameScore(frame, index === 9)}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Running Scores */}
          <View style={styles.runningScoresRow}>
            {player.frames.map((frame, index) => (
              <View 
                key={`running-${index}`} 
                style={[
                  styles.runningScore,
                  index === 9 ? styles.lastRunningScore : null,
                ]}
              >
                <Text style={styles.runningScoreText}>
                  {frame.score !== null ? frame.score : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Total Score */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalScore}>{player.totalScore || 0}</Text>
      </View>
      
      {/* Pin Selection for active frame */}
      {isEditable && selectedFrame !== null && selectedRoll !== null && renderPinButtons()}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  playerName: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.neutral[800],
    marginBottom: SPACING.m,
  },
  framesContainer: {
    flexDirection: 'column',
  },
  frameHeaderRow: {
    flexDirection: 'row',
  },
  frameHeader: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  lastFrameHeader: {
    width: 70,
  },
  frameHeaderText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary[700],
  },
  frameScoresRow: {
    flexDirection: 'row',
  },
  frameScore: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    backgroundColor: COLORS.white,
  },
  lastFrameScore: {
    width: 70,
  },
  selectedFrame: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[500],
    borderWidth: 2,
  },
  clickableFrame: {
    cursor: 'pointer',
  },
  frameScoreText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.neutral[800],
  },
  runningScoresRow: {
    flexDirection: 'row',
  },
  runningScore: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    backgroundColor: COLORS.neutral[50],
  },
  lastRunningScore: {
    width: 70,
  },
  runningScoreText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.neutral[700],
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    marginTop: SPACING.m,
    paddingTop: SPACING.m,
  },
  totalLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.neutral[800],
  },
  totalScore: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary[600],
  },
  pinSelection: {
    marginTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingTop: SPACING.m,
  },
  pinSelectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.neutral[700],
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  pinButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pinButton: {
    margin: 4,
    minWidth: 40,
  },
});