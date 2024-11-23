import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Switch, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyEvents from './MyEvents';
import EditProfile from './EditProfile';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../../contextProviders/AuthContext';
import { useProfile } from '../../contextProviders/ProfileContext';
import { Image } from 'expo-image';

import { changeLanguage } from '../../i18n';
import { useTranslation } from 'react-i18next';
import profile from '../../assets/images/useravatar.png';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
    const [isLoading, setIsLoading] = useState(false);  // Add loading state
    const { setAccessToken, accessToken } = useAuth();
    const { userProfile, setUserProfile } = useProfile();
    const { i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Sorry, we need permission to access your camera roll.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const formData = new FormData();
                formData.append('image', {
                    uri: imageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });

                setIsLoading(true);  // Show loader when upload starts

                try {
                    const response = await axios.put(`${API_URL}/users`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    if (response.status === 200) {
                        Alert.alert('Success', 'Image uploaded successfully!');
                        setUserProfile(response.data);
                    } else {
                        Alert.alert('Upload Error', 'Unexpected response from the server.');
                    }
                } catch (uploadError) {
                    console.error(uploadError);
                    Alert.alert('Upload Error', 'An error occurred while uploading the image.');
                } finally {
                    setIsLoading(false);  // Hide loader when upload completes
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while picking the image.');
            setIsLoading(false);  // Hide loader if error occurs
        }
    };

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem('language');
            if (savedLanguage) {
                setIsEnglish(savedLanguage);
            }
        };
        loadLanguage();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            setAccessToken(null);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to log out');
        }
    };

   /*  const toggleLanguage = async () => {
        const newLanguage = isEnglish ? 'fr' : 'en';
        setIsEnglish(!isEnglish);
        await changeLanguage(newLanguage);
    };  */


    return (
        <>

            <View style={styles.profileScreen}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                        {isLoading ? (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        ) : (
                            <>
                              <Image
                                source={{ uri: `${API_URL}${userProfile?.profilePicture}` } || profile}
                                style={styles.profileImage}
                                contentFit='cover' contentPosition='center'
                            />
                            <Text>Click to upload</Text>
                            </>
                          
                        )}
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                        <Text style={styles.username}>{userProfile?.name}</Text>
                        <Text style={styles.location}>{userProfile?.email}</Text>
                        <Text style={styles.phoneNumber}>{userProfile?.phoneNumber}</Text>
                    </View>
                </View>
                {/* <View style={styles.content} >
                     <Text style={styles.username}>Language</Text>
                        <View style={styles.toggleContainer}>

                            {!isEnglish && <Text style={styles.toggleLabel}>FR</Text>}
                            <Switch
                                value={isEnglish}
                                onValueChange={toggleLanguage}
                                thumbColor={isEnglish ? '#007AFF' : '#f4f3f4'}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                            />
                            {isEnglish && <Text style={styles.toggleLabel}>EN</Text>}
                        </View>
                     


                </View >
 */}
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
                style={styles.container}
            >

                <Tab.Navigator>
                    <Tab.Screen name="Edit Profile">
                        {() => <EditProfile userProfile={userProfile} />}
                    </Tab.Screen>
                    {/* <Tab.Screen name="My Events" component={MyEvents} /> */}
                </Tab.Navigator>

            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileScreen: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    imageContainer: {
        shadowColor: '#000',
        shadowOffset: { widthghc: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 50,
        marginRight: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
    },
    infoContainer: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: 'gray',
    },
    phoneNumber: {
        fontSize: 14,
        color: 'gray',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loadingOverlay: {
        width: 120,
        height: 120,
        borderWidth: 1,
        // borderColor: '#000',
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        alignItems: 'center',
    }
});
