import { Frame, Player } from '@/types/game';

// Calculate if a roll is a strike
const isStrike = (roll: number | null): boolean => roll === 10;

// Calculate if a frame is a spare
const isSpare = (roll1: number | null, roll2: number | null): boolean => {
  if (roll1 === null || roll2 === null) return false;
  return roll1 + roll2 === 10 && roll1 !== 10;
};

// Calculate score for a single frame
export const calculateFrameScore = (
  player: Player,
  frameIndex: number
): number | null => {
  const frames = player.frames;
  const frame = frames[frameIndex];
  
  if (!frame) return null;
  if (frame.roll1 === null) return null;
  
  // For a strike, we need the next two rolls
  if (isStrike(frame.roll1)) {
    // Last frame
    if (frameIndex === 9) {
      if (frame.roll2 === null || frame.roll3 === null) return null;
      return 10 + frame.roll2 + frame.roll3;
    }
    
    // Need next frame
    const nextFrame = frames[frameIndex + 1];
    if (!nextFrame || nextFrame.roll1 === null) return null;
    
    // If next frame is a strike and not the last frame, we need the frame after that
    if (isStrike(nextFrame.roll1) && frameIndex < 8) {
      const afterNextFrame = frames[frameIndex + 2];
      if (!afterNextFrame || afterNextFrame.roll1 === null) return null;
      return 10 + 10 + afterNextFrame.roll1;
    }
    
    // If next frame is a strike and it's the 9th frame (last frame)
    if (isStrike(nextFrame.roll1) && frameIndex === 8) {
      if (nextFrame.roll2 === null) return null;
      return 10 + 10 + nextFrame.roll2;
    }
    
    // Next frame is not a strike
    if (nextFrame.roll2 === null) return null;
    return 10 + nextFrame.roll1 + nextFrame.roll2;
  }
  
  // For a spare, we need the next roll
  if (frame.roll2 !== null && isSpare(frame.roll1, frame.roll2)) {
    // Last frame
    if (frameIndex === 9) {
      if (frame.roll3 === null) return null;
      return 10 + frame.roll3;
    }
    
    // Need next frame
    const nextFrame = frames[frameIndex + 1];
    if (!nextFrame || nextFrame.roll1 === null) return null;
    return 10 + nextFrame.roll1;
  }
  
  // Open frame
  if (frame.roll2 === null) return null;
  return frame.roll1 + frame.roll2;
};

// Calculate running score (cumulative) for a specific frame
export const calculateRunningScore = (
  player: Player,
  frameIndex: number
): number | null => {
  if (frameIndex < 0) return 0;
  
  const previousScore = frameIndex > 0 
    ? calculateRunningScore(player, frameIndex - 1) 
    : 0;
    
  if (previousScore === null) return null;
  
  const frameScore = calculateFrameScore(player, frameIndex);
  if (frameScore === null) return null;
  
  return previousScore + frameScore;
};

// Calculate total score for a player
export const calculateTotalScore = (player: Player): number => {
  const lastFrameScore = calculateRunningScore(player, 9);
  return lastFrameScore !== null ? lastFrameScore : 0;
};

// Update a player's frame with a new roll and recalculate scores
export const updatePlayerScore = (
  player: Player,
  frameIndex: number,
  rollIndex: 1 | 2 | 3,
  pins: number
): Player => {
  const updatedFrames = [...player.frames];
  const frame = { ...updatedFrames[frameIndex] };
  
  // Update the specific roll
  if (rollIndex === 1) frame.roll1 = pins;
  else if (rollIndex === 2) frame.roll2 = pins;
  else if (rollIndex === 3 && frameIndex === 9) frame.roll3 = pins;
  
  // Update strike/spare flags
  frame.isStrike = isStrike(frame.roll1);
  frame.isSpare = isSpare(frame.roll1, frame.roll2);
  
  // Update the frame in our frames array
  updatedFrames[frameIndex] = frame;
  
  // Recalculate all scores (since a change in one frame can affect subsequent frames)
  for (let i = 0; i < updatedFrames.length; i++) {
    const updatedFrame = { ...updatedFrames[i] };
    updatedFrame.score = calculateRunningScore(
      { ...player, frames: updatedFrames },
      i
    );
    updatedFrames[i] = updatedFrame;
  }
  
  // Calculate total score
  const totalScore = calculateRunningScore(
    { ...player, frames: updatedFrames },
    9
  ) || 0;
  
  return {
    ...player,
    frames: updatedFrames,
    totalScore,
  };
};

// Get the next available roll for a player
export const getNextRoll = (
  player: Player
): { frameIndex: number; rollIndex: 1 | 2 | 3 } | null => {
  const frames = player.frames;
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    
    // If roll1 is null, that's our next roll
    if (frame.roll1 === null) {
      return { frameIndex: i, rollIndex: 1 };
    }
    
    // If it's a strike and not the 10th frame, move to next frame
    if (frame.isStrike && i < 9) {
      continue;
    }
    
    // If roll2 is null, that's our next roll
    if (frame.roll2 === null) {
      return { frameIndex: i, rollIndex: 2 };
    }
    
    // For 10th frame with strike or spare, we need roll3
    if (i === 9 && (frame.isStrike || frame.isSpare) && frame.roll3 === null) {
      return { frameIndex: i, rollIndex: 3 };
    }
  }
  
  // All frames are complete
  return null;
};

// Format a roll value for display
export const formatRoll = (roll: number | null): string => {
  if (roll === null) return '';
  if (roll === 10) return 'X';
  if (roll === 0) return '-';
  return roll.toString();
};

// Format a frame score for display
export const formatFrameScore = (frame: Frame, isLastFrame: boolean): string => {
  if (frame.roll1 === null) return '';
  
  // Handle strike
  if (frame.isStrike) {
    if (isLastFrame) {
      let display = 'X';
      
      if (frame.roll2 !== null) {
        display += frame.roll2 === 10 ? ' X' : frame.roll2 === 0 ? ' -' : ` ${frame.roll2}`;
      }
      
      if (frame.roll3 !== null) {
        display += frame.roll3 === 10 ? ' X' : frame.roll3 === 0 ? ' -' : ` ${frame.roll3}`;
      }
      
      return display;
    }
    return 'X';
  }
  
  // Handle open frame or spare
  let display = frame.roll1 === 0 ? '-' : frame.roll1?.toString() || '';
  
  if (frame.roll2 !== null) {
    if (frame.isSpare) {
      display += ' /';
    } else {
      display += frame.roll2 === 0 ? ' -' : ` ${frame.roll2}`;
    }
  }
  
  // Handle 10th frame extra roll
  if (isLastFrame && frame.isSpare && frame.roll3 !== null) {
    display += frame.roll3 === 10 ? ' X' : frame.roll3 === 0 ? ' -' : ` ${frame.roll3}`;
  }
  
  return display;
};