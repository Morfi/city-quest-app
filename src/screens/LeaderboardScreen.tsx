import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { mockUsers } from '../data/mockData';

export default function LeaderboardScreen() {
  const [users] = useState([...mockUsers].sort((a, b) => b.completedQuests - a.completedQuests));

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Рейтинг игроков</Text>
      </View>
      {users.map((user, index) => (
        <View
          key={user.id}
          style={[styles.leaderboardItem, index < 3 && styles.topThree]}
        >
          <View style={styles.rankContainer}>
            <Text style={styles.medal}>{getMedal(index)}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.statsContainer}>
              <Text style={styles.stat}>✅ {user.completedQuests} квестов</Text>
              <Text style={styles.stat}>⭐ {user.totalPoints} очков</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{user.completedQuests}</Text>
            <Text style={styles.scoreLabel}>квестов</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderboardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topThree: {
    backgroundColor: '#fff9e6',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  medal: {
    fontSize: 28,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: 12,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
  },
});

