import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { mockQuests } from '../data/mockData';
import type { Quest } from '../types';

export default function QuestsScreen() {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужно разрешение на доступ к камере');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Выберите источник',
      'Откуда вы хотите загрузить фотографию?',
      [
        { text: 'Камера', onPress: takePhoto },
        { text: 'Галерея', onPress: pickImage },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const completeQuest = (questId: string) => {
    if (!uploadedImage) {
      Alert.alert('Ошибка', 'Пожалуйста, загрузите фотографию!');
      return;
    }

    setQuests(quests.map((q) => (q.id === questId ? { ...q, completed: true } : q)));
    setSelectedQuest(null);
    setUploadedImage(null);
    Alert.alert('Успех!', 'Квест выполнен! Фотография добавлена в ленту.');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎯 Текущие квесты</Text>
        </View>
        {quests.map((quest) => (
          <TouchableOpacity
            key={quest.id}
            style={[styles.questCard, quest.completed && styles.questCardCompleted]}
            onPress={() => !quest.completed && setSelectedQuest(quest)}
            disabled={quest.completed}
          >
            <View style={styles.questHeader}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsText}>+{quest.points}</Text>
              </View>
            </View>
            <Text style={styles.questDescription}>{quest.description}</Text>
            <View style={styles.questFooter}>
              <Text style={styles.location}>📍 {quest.location}</Text>
              {quest.completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Выполнено</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedQuest !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setSelectedQuest(null);
          setUploadedImage(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectedQuest(null);
                setUploadedImage(null);
              }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {selectedQuest && (
              <>
                <Text style={styles.modalTitle}>{selectedQuest.title}</Text>
                <Text style={styles.modalDescription}>{selectedQuest.description}</Text>

                <View style={styles.uploadSection}>
                  <TouchableOpacity style={styles.uploadButton} onPress={showImagePicker}>
                    <Text style={styles.uploadButtonText}>
                      {uploadedImage ? 'Фотография загружена ✓' : '📷 Загрузить фотографию'}
                    </Text>
                  </TouchableOpacity>

                  {uploadedImage && (
                    <View style={styles.previewContainer}>
                      <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, !uploadedImage && styles.submitButtonDisabled]}
                  onPress={() => completeQuest(selectedQuest.id)}
                  disabled={!uploadedImage}
                >
                  <Text style={styles.submitButtonText}>Отправить квест</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  questCardCompleted: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  completedBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 32,
    color: '#999',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#667eea',
  },
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

