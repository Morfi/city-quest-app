import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { mockPhotos, mockQuests } from '../data/mockData';
import type { Photo, Quest } from '../types';

const { width } = Dimensions.get('window');

export default function FeedScreen() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [filterQuestId, setFilterQuestId] = useState<string | null>(null);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    return 'Только что';
  };

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
      setSelectedImage(result.assets[0].uri);
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
      setSelectedImage(result.assets[0].uri);
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

  const handleCreatePhoto = () => {
    if (!selectedQuest) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите квест');
      return;
    }
    if (!selectedImage) {
      Alert.alert('Ошибка', 'Пожалуйста, загрузите фотографию');
      return;
    }

    const newPhoto: Photo = {
      id: Date.now().toString(),
      questId: selectedQuest.id,
      questTitle: selectedQuest.title,
      userId: 'currentUser',
      userName: 'Вы',
      imageUrl: selectedImage,
      location: location || selectedQuest.location,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setPhotos([newPhoto, ...photos]);
    setShowCreateModal(false);
    setSelectedQuest(null);
    setSelectedImage(null);
    setLocation('');
    Alert.alert('Успех!', 'Фотография добавлена в ленту');
  };

  const resetModal = () => {
    setShowCreateModal(false);
    setSelectedQuest(null);
    setSelectedImage(null);
    setLocation('');
  };

  // Фильтрация фотографий по выбранному квесту
  const filteredPhotos = filterQuestId
    ? photos.filter((photo) => photo.questId === filterQuestId)
    : photos;

  // Получение уникальных квестов из фотографий
  const getUniqueQuests = () => {
    const questIds = new Set(photos.map((photo) => photo.questId));
    return mockQuests.filter((quest) => questIds.has(quest.id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📸 Лента фотографий</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>➕ Создать фотографию</Text>
        </TouchableOpacity>

        {/* Фильтр по квестам */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>🔍 Фильтр по квестам:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !filterQuestId && styles.filterChipActive,
              ]}
              onPress={() => setFilterQuestId(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !filterQuestId && styles.filterChipTextActive,
                ]}
              >
                Все
              </Text>
            </TouchableOpacity>
            {getUniqueQuests().map((quest) => (
              <TouchableOpacity
                key={quest.id}
                style={[
                  styles.filterChip,
                  filterQuestId === quest.id && styles.filterChipActive,
                ]}
                onPress={() => setFilterQuestId(quest.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterQuestId === quest.id && styles.filterChipTextActive,
                  ]}
                >
                  {quest.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {filterQuestId && (
            <Text style={styles.filterCount}>
              Показано: {filteredPhotos.length} из {photos.length}
            </Text>
          )}
        </View>

        {filteredPhotos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              📷 Нет фотографий для выбранного квеста
            </Text>
          </View>
        ) : (
          filteredPhotos.map((photo) => (
        <View key={photo.id} style={styles.photoCard}>
          <View style={styles.photoHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{photo.userName[0]}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{photo.userName}</Text>
                <Text style={styles.questTitle}>{photo.questTitle}</Text>
              </View>
            </View>
            <Text style={styles.time}>{formatTime(photo.timestamp)}</Text>
          </View>
          <Image source={{ uri: photo.imageUrl }} style={styles.photo} />
          <View style={styles.photoFooter}>
            <Text style={styles.location}>📍 {photo.location}</Text>
            <View style={styles.likesContainer}>
              <Text style={styles.likes}>❤️ {photo.likes}</Text>
            </View>
          </View>
        </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Создать фотографию</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Выберите квест:</Text>
              <ScrollView style={styles.questsList} nestedScrollEnabled>
                {mockQuests.map((quest) => (
                  <TouchableOpacity
                    key={quest.id}
                    style={[
                      styles.questOption,
                      selectedQuest?.id === quest.id && styles.questOptionSelected,
                    ]}
                    onPress={() => setSelectedQuest(quest)}
                  >
                    <View style={styles.questOptionContent}>
                      <Text style={styles.questOptionTitle}>{quest.title}</Text>
                      <Text style={styles.questOptionDescription}>
                        {quest.description}
                      </Text>
                      <Text style={styles.questOptionLocation}>
                        📍 {quest.location} • +{quest.points} очков
                      </Text>
                    </View>
                    {selectedQuest?.id === quest.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Фотография:</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={showImagePicker}>
                <Text style={styles.uploadButtonText}>
                  {selectedImage ? 'Фотография загружена ✓' : '📷 Загрузить фотографию'}
                </Text>
              </TouchableOpacity>

              {selectedImage && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Местоположение (необязательно):</Text>
              <TextInput
                style={styles.locationInput}
                placeholder="Введите местоположение"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedQuest || !selectedImage) && styles.submitButtonDisabled,
              ]}
              onPress={handleCreatePhoto}
              disabled={!selectedQuest || !selectedImage}
            >
              <Text style={styles.submitButtonText}>Опубликовать</Text>
            </TouchableOpacity>
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
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  questTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  photo: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  photoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  location: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterContainer: {
    paddingRight: 16,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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
    maxHeight: '90%',
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
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  questsList: {
    maxHeight: 200,
  },
  questOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  questOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  questOptionContent: {
    flex: 1,
  },
  questOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  questOptionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  questOptionLocation: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: 'bold',
    marginLeft: 10,
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
    height: 200,
    resizeMode: 'cover',
  },
  locationInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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

