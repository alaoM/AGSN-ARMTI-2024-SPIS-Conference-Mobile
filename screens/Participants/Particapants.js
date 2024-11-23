import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Button,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { API_URL } from '@env';
import { useAuth } from '../../contextProviders/AuthContext';
import profile from '../../assets/images/useravatar.png';
import { useTranslation } from 'react-i18next';
import { shortenText } from '../../assets/libs/helper';
import { useForm } from 'react-hook-form';
import { Image } from 'expo-image';
const UserItem = React.memo(({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(user)}>
      <View style={styles.userCard}>
        <Image
          source={user.profilePicture ? { uri: `${API_URL}${user.profilePicture}` } : profile}
          style={styles.profileImage}
          contentFit='cover' contentPosition='center'
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userBio}>{shortenText(user.bio, 170)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { accessToken } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setRefreshing(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchUsers();
  };

  const filterUsers = () => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

 /*  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchUsers();
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while updating profile');
    } finally {
      setIsUpdating(false);
    }
  }; */

  const renderItem = useCallback(({ item, index }) => (
    <UserItem
      key={`${index}-${Date.now()}`}  
      user={item}
      onPress={openModal}
    />
  ), []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load users: {error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => `${index}-${Date.now()}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* Modal for full user preview */}
        {selectedUser && (
          <Modal
            visible={true}
            animationType="slide"
            onRequestClose={closeModal}
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Image
                    source={selectedUser.profilePicture ? { uri: `${API_URL}${selectedUser.profilePicture}` } : profile}
                    style={styles.modalProfileImage}
                         contentFit='contain' contentPosition='center'
                  />
                  <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                  {selectedUser.bio !== "" && (
                    <>
                      <Text style={styles.bioHeader}>{t('biography')}</Text>
                      <Text style={styles.modalUserBio}>{selectedUser.bio}</Text>
                    </>
                  )}
                </ScrollView>
                <Button title="Close" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        )}

        {/* Bio Update Section */}
      {/*   <View style={styles.bioUpdateContainer}>
          <Controller
            control={control}
            name="bio"
            defaultValue={selectedUser?.bio || ''}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.bioInput}>
                <TextInput
                  style={[styles.input]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Update your bio..."
                  multiline
                  numberOfLines={10}
                />
                {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
              </View>
            )}
            rules={{ maxLength: { value: 1500, message: 'Bio should be less than 1500 characters' } }}
          />

          <TouchableOpacity style={styles.sendButton} disabled={isUpdating} onPress={handleSubmit(onSubmit)}>
            {
              isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="send" size={20} color="#fff" />
            }
          </TouchableOpacity>
        </View> */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  userCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,  
  },
  modalProfileImage: {
    width: "100%", // Ensures full width
    height: 400,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalUserName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalUserBio: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  bioUpdateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  bioInput: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 50,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default UsersList;
