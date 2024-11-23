import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
  TextInput,
  Button,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contextProviders/AuthContext';
import { API_URL } from '@env';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { extractFileNameFromURI } from '../../assets/libs/helper';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
// Extract file extension from URL
const getFileExtension = (url) => {
  const parts = url.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'unknown';
};

// Save the file to storage
const save = async (uri, filename, mimetype) => {
  if (Platform.OS === "android") {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        })
        .catch(e => console.log(e));
    } else {
      Sharing.shareAsync(uri);
    }
  } else {
    Sharing.shareAsync(uri);
  }
};

const FieldTrip = ({ navigation }) => {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { accessToken } = useAuth();
  const [loadingStates, setLoadingStates] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false)
  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };
  const { control, handleSubmit, reset } = useForm();
  const [isPicking, setIsPicking] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const pickFileOrImage = async (type) => {
    if (isPicking) {
     
      console.warn('A file or image picking operation is already in progress.');
      return;
    }

    setIsPicking(true); // Set picking state to true

    try {
      let pickerResult;

      if (type === 'image') {
        // Request camera roll permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.error('Sorry, we need camera roll permissions to proceed.');
          setIsPicking(false);
          return;
        }

        // Show the image picker options
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });

      } else if (type === 'file') {
        /* pickerResult.canceled */
        // Show the file picker options
        pickerResult = await DocumentPicker.getDocumentAsync({
          type: '*',
          copyToCacheDirectory: true,
        });
      }

      // Handle selected image or file
      if (!pickerResult.canceled) {
        setSelectedContent(pickerResult);
      }

    } catch (error) {
      console.error('Error picking file or image:', error);
    } finally {
      setShowAttachmentOptions(!showAttachmentOptions);
      setIsPicking(false); // Reset picking state after completion
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      setLoadingStates({});
    }
    setAppState(nextAppState);
  };

  const handleFileAction = async (fileUrl, fileName, action) => {
    try {
      setLoadingStates((prevState) => ({ ...prevState, [fileName]: true }));

      const fullFileUrl = `${API_URL}/field-trip/download/${fileName}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const result = await FileSystem.downloadAsync(fullFileUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "MyHeader": "MyValue"
        }
      });
      const { uri } = result;

      if (action === 'open') {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      } else if (action === 'save') {
        save(uri, fileName, result.headers["Content-Type"]);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file: ' + error.message);
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [fileName]: false }));
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await fetch(`${API_URL}/field-trip`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch conference materials.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMaterials();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true)
      if (!selectedContent) {
        Alert.alert('Error', 'Please select a file to upload.');
        return;
      }
      const { assets } = selectedContent;
      if (!assets || assets.length === 0) {
        Alert.alert('Error', 'No file selected.');
        return;
      }

      const content = assets[0];

      // Construct FormData
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.language);
      formData.append('shortDescription', data.shortDescription);

      formData.append('file', {
        uri: content.uri,
        name: content.name || content.fileName || 'unknown',  
        type: content.mimeType || 'application/octet-stream',  
      });


      const response = await axios.post(`${API_URL}/field-trip/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'File uploaded successfully');
        await fetchMaterials(); // Ensure fetchMaterials is awaited if it's async
        reset(); // Ensure reset is correctly resetting the form
        setSelectedContent(null); // Reset the selected content
      } else {
        throw new Error('Upload failed with status ' + response.status);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Failed to upload file: ${error.message}`);
    } finally {
      setSubmitLoading(false)
    }
  };


  const renderMaterialItem = ({ item }) => {
    const fileName = extractFileNameFromURI(item.url);
    const fileExtension = getFileExtension(item.url);

    const renderFilePreview = () => {
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        return <Image source={{ uri: `${API_URL}${item.url}` }} style={styles.previewImage} />;
      } else if (fileExtension === 'pdf') {
        return <Text style={styles.filePreviewText}>PDF Document</Text>;
      } else if (['doc', 'docx'].includes(fileExtension)) {
        return <Text style={styles.filePreviewText}>Word Document</Text>;
      } else if (['ppt', 'pptx'].includes(fileExtension)) {
        return <Text style={styles.filePreviewText}>PowerPoint Presentation</Text>;
      } else {
        return <Text style={styles.filePreviewText}>Unknown File Type</Text>;
      }
    };

    return (
      <View style={styles.materialItem}>
        <Text style={styles.materialName}>{item.name}</Text>
        {renderFilePreview()}
        {!['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) && (
          <>
            <Text style={styles.fileExtension}>File Type: {fileExtension.toUpperCase()}</Text>
            <Text style={styles.materialType}>Language: {item.type}</Text>
            <Text style={styles.materialDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <View style={styles.buttonContainer}>
              <CustomButton
                title={`Open`}
                onPress={() => handleFileAction(item.url, fileName, 'open')}
                backgroundColor="#4CAF50"
                fileName={fileName}
              />
       {/*        <CustomButton
                title={`Save`}
                onPress={() => handleFileAction(item.url, fileName, 'save')}
                backgroundColor="#2196F3"
                fileName={fileName}
              /> */}
            </View>
          </>
        )}
      </View>
    );
  };

  const CustomButton = ({ title, onPress, backgroundColor, fileName }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      disabled={loadingStates[fileName]}
    >
      {loadingStates[fileName] ? (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="white" />
        </View>
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,  }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        renderItem={renderMaterialItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            title={t('pull_to_refresh')}
            titleColor="#000"
          />
        }
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>{t('no_materials_found')}</Text>
        }
      />

      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <Text style={styles.formTitle}>{t('upload_new_material')}</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Name"
            />
          )}
        />
        <Controller
          control={control}
          name="language"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Language (optional)"
            />
          )}
        />
        <Controller
          control={control}
          name="shortDescription"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Short Description (optional)"
              multiline={true}
              numberOfLines={4}
            />
          )}
        />
        <View style={styles.attachmentContainer}>
         
          <TouchableOpacity onPress={toggleAttachmentOptions} style={styles.attachmentIconButton}>
            <MaterialIcons name="attach-file" size={24} color={"#fff"} style={styles.optionIcon} />
          </TouchableOpacity>

          {/* Show options when toggled */}
          {showAttachmentOptions && (
            <View style={styles.attachmentOptions}>
              <TouchableOpacity onPress={() => pickFileOrImage('image')} style={styles.attachmentOption}>
                <MaterialIcons name="image" size={24} color={"#fff"} style={styles.optionIcon} />
                <Text style={styles.optionText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickFileOrImage('file')} style={styles.attachmentOption}>
                <MaterialIcons name="insert-drive-file" size={24} color={"#fff"} style={styles.optionIcon} />
                <Text style={styles.optionText}>File</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.filePickerButton}>
            {
              submitLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.filePickerButtonText}>Upload</Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  materialItem: {
    margin:10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    borderRadius: 8,
    height: 400,
    marginBottom: 16,
    objectFit: 'cover',
    resizeMode: 'cover',
  },
  filePreviewText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  materialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  materialType: {
    fontSize: 14,
    color: '#777',
  },
  materialDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  fileExtension: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  filePickerButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  attachmentIconButton: {

    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0009',
    position: 'relative',
  },
  attachmentOptions: {
    position: 'absolute',
    top: -110, // Display options above the button
    left: 0,
    backgroundColor: '#0009',
    elevation: 3,
    borderRadius: 5,
    paddingVertical: 5,
    zIndex: 1, // Ensure the dropdown appears on top
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  filePickerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 15,
    flex: 1, // Allow button to take remaining space
  },
  filePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FieldTrip;
