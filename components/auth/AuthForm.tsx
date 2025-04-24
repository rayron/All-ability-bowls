import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { LoginCredentials, SignupCredentials } from '@/types/auth';
import { api } from '@/utils/api';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials | SignupCredentials>({
    email: '',
    password: '',
    ...(type === 'signup' ? { username: '' } : {}),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
    
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (type === 'signup') {
      const signupCreds = credentials as SignupCredentials;
      if (!signupCreds.username) {
        newErrors.username = 'Username is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      if (type === 'login') {
        const { email, password } = credentials as LoginCredentials;
        await api.auth.login(email, password);
      } else {
        const { email, password, username } = credentials as SignupCredentials;
        await api.auth.signup(email, password, username);
      }
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({
        auth: (error as Error).message || 'Authentication failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAlternateForm = () => {
    if (type === 'login') {
      router.push('/(auth)/signup');
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      {errors.auth && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.auth}</Text>
        </View>
      )}
      
      {type === 'signup' && (
        <Input
          label="Username"
          placeholder="Enter your username"
          value={(credentials as SignupCredentials).username || ''}
          onChangeText={(text) => handleChange('username', text)}
          leftIcon={<User color={COLORS.neutral[500]} size={20} />}
          error={errors.username}
          autoCapitalize="none"
        />
      )}
      
      <Input
        label="Email"
        placeholder="Enter your email"
        value={credentials.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        leftIcon={<Mail color={COLORS.neutral[500]} size={20} />}
        error={errors.email}
        autoCapitalize="none"
      />
      
      <Input
        label="Password"
        placeholder="Enter your password"
        value={credentials.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        leftIcon={<Lock color={COLORS.neutral[500]} size={20} />}
        error={errors.password}
      />
      
      <Button
        title={type === 'login' ? 'Login' : 'Sign Up'}
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
        </Text>
        <Text style={styles.footerLink} onPress={navigateToAlternateForm}>
          {type === 'login' ? 'Sign Up' : 'Login'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: COLORS.error[100],
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
  },
  errorText: {
    color: COLORS.error[700],
    fontFamily: FONTS.medium,
  },
  submitButton: {
    marginTop: SPACING.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontFamily: FONTS.regular,
    color: COLORS.neutral[600],
  },
  footerLink: {
    fontFamily: FONTS.medium,
    color: COLORS.primary[500],
  },
});