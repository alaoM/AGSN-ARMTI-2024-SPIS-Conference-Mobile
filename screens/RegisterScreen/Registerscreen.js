import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@env';

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, data);
            
            if (response.data.success) {
                Alert.alert(
                    t('registrationSuccess'),
                    response.data.message,
                    [
                        {
                            text: t('ok'),
                            onPress: () => navigation.navigate('Login'),
                        },
                    ],
                );
            } else {
                Alert.alert(t('registrationFailed'), response.data.message);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || t('registrationError');
            Alert.alert(t('error'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>{t('registerTitle')}</Text>

                <Text style={styles.label}>{t('name')}</Text>
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: t('nameRequired') }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={t('namePlaceholder')}
                        />
                    )}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                <Text style={styles.label}>{t('email')}</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: t('emailRequired'),
                        pattern: { value: /^\S+@\S+$/, message: t('invalidEmail') }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={t('emailPlaceholder')}
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
                        required: t('passwordRequired'),
                        minLength: { value: 6, message: t('passwordMinLength') }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={t('passwordPlaceholder')}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{t('register')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.registerText}>{t('loginPrompt')}</Text>
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

export default RegisterScreen;
