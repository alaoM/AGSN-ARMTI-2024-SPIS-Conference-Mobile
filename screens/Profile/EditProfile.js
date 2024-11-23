import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useProfile } from '../../contextProviders/ProfileContext';
import { useAuth } from '../../contextProviders/AuthContext';

export default function EditProfile({ userProfile, navigation }) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isUpdating, setIsUpdating] = useState(false);

    const { setUserProfile } = useProfile()
    const { accessToken } = useAuth()
     
    const onSubmit = async (data) => {
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
                const result = await response.json();
                setUserProfile(result)
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
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Update Profile</Text>

            <Controller
                control={control}
                name="name"
                defaultValue={userProfile?.name || ''}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder={userProfile?.name}
                        />
                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                    </View>
                )}
                rules={{ required: 'Name is required' }}
            />

            <Controller
                control={control}
                name="phoneNumber"
                defaultValue={userProfile?.phoneNumber || ''}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder={userProfile?.phoneNumber}
                            keyboardType="phone-pad"
                        />
                        {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber.message}</Text>}
                    </View>
                )}
                rules={{ required: 'Phone number is required' }}
            />

            <Controller
                control={control}
                name="bio"
                defaultValue={userProfile?.bio || ''}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder={userProfile?.bio}
                            multiline
                            numberOfLines={10}
                        />
                        {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
                    </View>
                )}
                rules={{ maxLength: { value: 1500, message: 'Bio should be less than 1500 characters' } }}
            />

            <TouchableOpacity
                style={[styles.button, isUpdating && styles.buttonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isUpdating}
            >
                <Text style={styles.buttonText}>{isUpdating ? 'Updating...' : 'Update Profile'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#555',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
