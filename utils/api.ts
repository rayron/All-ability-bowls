import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Mock API URL - to be replaced with actual API endpoint
const API_URL = 'https://your-bowling-api.com/api';

// Mock token storage
async function getToken() {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage
      return localStorage.getItem('authToken');
    } else {
      // For native, use SecureStore
      return await SecureStore.getItemAsync('authToken');
    }
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

async function setToken(token: string) {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage
      localStorage.setItem('authToken', token);
    } else {
      // For native, use SecureStore
      await SecureStore.setItemAsync('authToken', token);
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
}

async function removeToken() {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage
      localStorage.removeItem('authToken');
    } else {
      // For native, use SecureStore
      await SecureStore.deleteItemAsync('authToken');
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

async function apiFetch(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  requireAuth: boolean = true
) {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// For demonstration purposes, we'll export mock API functions
// that would normally interact with a backend server
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      // In a real app, this would call your API
      // For demo, just return mock data
      const mockResponse = {
        user: {
          id: '1',
          email: email,
          username: email.split('@')[0],
          isAdmin: email.includes('admin'),
          createdAt: new Date().toISOString(),
        },
        token: 'mock-token-12345',
      };
      
      await setToken(mockResponse.token);
      return mockResponse.user;
    },
    signup: async (email: string, password: string, username: string) => {
      // Mock signup
      const mockResponse = {
        user: {
          id: '1',
          email,
          username,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        },
        token: 'mock-token-12345',
      };
      
      await setToken(mockResponse.token);
      return mockResponse.user;
    },
    logout: async () => {
      await removeToken();
      return true;
    },
    checkAuth: async () => {
      const token = await getToken();
      if (!token) return null;
      
      // Mock user data
      return {
        id: '1',
        email: 'user@example.com',
        username: 'user',
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };
    },
  },
  
  // Games endpoints
  games: {
    getAll: async () => {
      // Mock game data
      return [
        {
          id: '1',
          name: 'Friday Night League',
          location: 'Sunset Lanes',
          date: '2025-06-20T18:00:00Z',
          players: [
            {
              id: '1',
              name: 'Player 1',
              frames: Array(10).fill(null).map((_, i) => ({
                frameNumber: i + 1,
                roll1: Math.floor(Math.random() * 11),
                roll2: Math.floor(Math.random() * 11),
                roll3: i === 9 ? Math.floor(Math.random() * 11) : null,
                isStrike: false,
                isSpare: false,
                score: null,
              })),
              totalScore: 0,
            },
            {
              id: '2',
              name: 'Player 2',
              frames: Array(10).fill(null).map((_, i) => ({
                frameNumber: i + 1,
                roll1: null,
                roll2: null,
                roll3: null,
                isStrike: false,
                isSpare: false,
                score: null,
              })),
              totalScore: 0,
            },
          ],
          isActive: true,
          createdBy: 'admin',
          createdAt: '2025-06-20T15:30:00Z',
        },
        {
          id: '2',
          name: 'Weekend Tournament',
          location: 'Strike City',
          date: '2025-06-21T14:00:00Z',
          players: [
            {
              id: '3',
              name: 'Player 3',
              frames: Array(10).fill(null).map((_, i) => ({
                frameNumber: i + 1,
                roll1: null,
                roll2: null,
                roll3: null,
                isStrike: false,
                isSpare: false,
                score: null,
              })),
              totalScore: 0,
            },
          ],
          isActive: true,
          createdBy: 'admin',
          createdAt: '2025-06-20T10:00:00Z',
        },
      ];
    },
    getById: async (id: string) => {
      // Mock single game data
      return {
        id,
        name: 'Friday Night League',
        location: 'Sunset Lanes',
        date: '2025-06-20T18:00:00Z',
        players: [
          {
            id: '1',
            name: 'Player 1',
            frames: Array(10).fill(null).map((_, i) => ({
              frameNumber: i + 1,
              roll1: Math.floor(Math.random() * 11),
              roll2: Math.floor(Math.random() * 11),
              roll3: i === 9 ? Math.floor(Math.random() * 11) : null,
              isStrike: false,
              isSpare: false,
              score: null,
            })),
            totalScore: 0,
          },
          {
            id: '2',
            name: 'Player 2',
            frames: Array(10).fill(null).map((_, i) => ({
              frameNumber: i + 1,
              roll1: null,
              roll2: null,
              roll3: null,
              isStrike: false,
              isSpare: false,
              score: null,
            })),
            totalScore: 0,
          },
        ],
        isActive: true,
        createdBy: 'admin',
        createdAt: '2025-06-20T15:30:00Z',
      };
    },
    updateScore: async (gameId: string, playerId: string, frameNumber: number, rollNumber: number, pins: number) => {
      // In a real app, this would update the score on the server
      console.log(`Updated score for Game ${gameId}, Player ${playerId}, Frame ${frameNumber}, Roll ${rollNumber}: ${pins} pins`);
      return true;
    },
    createGame: async (gameData: any) => {
      // Mock create game
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...gameData,
        createdAt: new Date().toISOString(),
      };
    },
  },
};