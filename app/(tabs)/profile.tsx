import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { LogOut, User, CreditCard as Edit3, Mail, Calendar, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    joinDate: '',
  });
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    loadUserData();
    loadFavoriteCount();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setTempName(parsedUser.name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadFavoriteCount = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        setFavoriteCount(JSON.parse(favorites).length);
      }
    } catch (error) {
      console.error('Error loading favorite count:', error);
    }
  };

  const saveUserData = async () => {
    try {
      const updatedUser = { ...user, name: tempName };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              router.replace('/auth/login');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const StatCard = ({ icon, title, value, color }: any) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[color, color + '20']}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon}
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.headerGradient}
          >
            <View style={styles.avatarContainer}>
              <User size={40} color="#ffffff" />
            </View>
            
            <View style={styles.userInfo}>
              {editing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={() => {
                        setTempName(user.name);
                        setEditing(false);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, styles.saveButton]}
                      onPress={saveUserData}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.nameContainer}>
                    <Text style={styles.userName}>
                      {user.name || 'Pokémon Trainer'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setEditing(true)}
                      style={styles.editIcon}
                    >
                      <Edit3 size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={<Trophy size={24} color="#F59E0B" />}
            title="Favorites"
            value={favoriteCount}
            color="#F59E0B"
          />
          <StatCard
            icon={<Calendar size={24} color="#10B981" />}
            title="Days Active"
            value={Math.floor(Math.random() * 30) + 1}
            color="#10B981"
          />
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Email</Text>
            </View>
            <Text style={styles.menuItemValue}>{user.email}</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Join Date</Text>
            </View>
            <Text style={styles.menuItemValue}>
              {user.joinDate || new Date().toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  editIcon: {
    padding: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    width: '100%',
    textAlign: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: '600',
  },
});