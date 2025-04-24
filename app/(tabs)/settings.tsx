import React from 'react';
import { View, StyleSheet, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Bell, Moon, Info, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={COLORS.neutral[600]} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[400] }}
              thumbColor={COLORS.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={COLORS.neutral[600]} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[400] }}
              thumbColor={COLORS.white}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.card}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={COLORS.neutral[600]} />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={COLORS.neutral[600]} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Info size={20} color={COLORS.neutral[600]} />
              <Text style={styles.settingText}>About</Text>
            </View>
            <ChevronRight size={20} color={COLORS.neutral[600]} />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        
        <Card style={styles.card}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleLogout}
          >
            <View style={styles.settingInfo}>
              <LogOut size={20} color={COLORS.error[500]} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </Card>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.neutral[600],
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  card: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.neutral[700],
    marginLeft: SPACING.s,
  },
  logoutText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.error[500],
    marginLeft: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  versionContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.neutral[500],
  },
});