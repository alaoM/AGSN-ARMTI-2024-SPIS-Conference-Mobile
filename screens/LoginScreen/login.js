import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../contextProviders/AuthContext';
import { API_URL } from '@env';
import { storeDataWithExpiration } from '../../utils/authHelper';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors } } = useForm();
    const { setAccessToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);  
        try {
            const response = await axios.post(`${API_URL}/auth/signin`, data);

            if (response.data.success) {
                const token = response.data.accessToken;
                
                await storeDataWithExpiration('accessToken', token);
                await storeDataWithExpiration('userToken', data);
               
                setAccessToken(token);
                // Navigate to the next screen if needed
            } else {
                Alert.alert(t('login_failed'), t('try_again'));
            }
        } catch (error) {
            Alert.alert(t('error'), error?.response?.data?.message || t('something_went_wrong'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>{t('login')}</Text>

                <Text style={styles.label}>{t('email')}</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{ 
                        required: t('email_required'), 
                        pattern: { 
                            value: /^\S+@\S+$/, 
                            message: t('invalid_email') 
                        } 
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={t('email_placeholder')}
                            keyboardType="email-address"
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Text style={styles.label}>{t('password')}</Text>
                <Controller
                    control={control}
                    name="password"
                    rules={{ 
                        required: t('password_required'), 
                        minLength: { 
                            value: 6, 
                            message: t('password_min_length') 
                        } 
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={t('password_placeholder')}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{t('login')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>{t('register_prompt')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <View>
                    <Text style={styles.logoText}>AGSN-ARMTI 2024</Text>
                    <Text style={styles.logoText}>SPIS Conference</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'black',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    registerText: {
        color: '#000',
        marginTop: 20,
        textAlign: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    logoText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
