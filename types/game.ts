export interface Frame {
  frameNumber: number;
  roll1: number | null;
  roll2: number | null;
  roll3: number | null; // Only used for 10th frame
  isStrike: boolean;
  isSpare: boolean;
  score: number | null; // Running score including this frame
}

export interface Player {
  id: string;
  name: string;
  frames: Frame[];
  totalScore: number;
}

export interface Game {
  id: string;
  name: string;
  location: string;
  date: string;
  players: Player[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}