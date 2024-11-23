import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Platform, Linking, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useAuth } from '../../contextProviders/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RegistrationScreen() {
    const { t } = useTranslation(); // Initialize useTranslation hook
    const accessToken = useAuth();

    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    const [datePickerMode, setDatePickerMode] = useState(null);
    const [dateField, setDateField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDatePickers, setShowDatePickers] = useState({});

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/event-registrations/register/74c7ba5b-77f6-4502-a407-db52950ef7f1`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${accessToken.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                reset();
                alert(t('registrationSuccess'));
            } else {
                alert(`${t('error')}: ${result.message}`);
            }
        } catch (error) {
            console.log(error);
            alert(`${t('registrationFailed')}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const showDatePicker = (mode, field) => {
        setDatePickerMode(mode);
        setDateField(field);
    };

    const handleDateChange = (name, selectedDate, onChange) => {
        setShowDatePickers((prev) => ({ ...prev, [name]: false }));
        const currentDate = selectedDate || new Date();
        onChange(currentDate.toISOString().split('T')[0]);
    };

    const showDatePickerHandler = (name) => {
        setShowDatePickers((prev) => ({ ...prev, [name]: true }));
    };

    const handleTimeChange = (name, selectedDate, onChange) => {
        setShowDatePickers((prev) => ({ ...prev, [name]: false }));
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const openWhatsApp = () => {
        const url = 'https://chat.whatsapp.com/GJNJVQKeNLAEdZAoVzrFlQ';
        Linking.openURL(url).catch((err) => console.error(t('whatsappError'), err));
    };

    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>{t('registrationForm')}</Text>

                <Text style={styles.label}>{t('country')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('country')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterCountry')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
                        </>
                    )}
                    name="country"
                />

                <Text style={styles.label}>{t('residence')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('residence')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterResidence')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.residence && <Text style={styles.errorText}>{errors.residence.message}</Text>}
                        </>
                    )}
                    name="residence"
                />

                <Text style={styles.label}>{t('surname')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('surname')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterSurname')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.surname && <Text style={styles.errorText}>{errors.surname.message}</Text>}
                        </>
                    )}
                    name="surname"
                />

                <Text style={styles.label}>{t('firstName')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('firstName')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterFirstname')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.firstname && <Text style={styles.errorText}>{errors.firstname.message}</Text>}
                        </>
                    )}
                    name="firstname"
                />

                <Text style={styles.label}>{t('email')}</Text>
                <Controller
                    control={control}
                    rules={{
                        required: `${t('email')} ${t('required')}`,
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: t('invalidEmail')
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterEmail')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                        </>
                    )}
                    name="email"
                />

                <Text style={styles.label}>{t('dateOfBirth')}</Text>
                <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity onPress={() => showDatePickerHandler('dateOfBirth')}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('enterDOB')}
                                    value={value}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            {showDatePickers.dateOfBirth && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => handleDateChange('dateOfBirth', selectedDate, onChange)}
                                />
                            )}
                        </>
                    )}
                />
                {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>}

                <Text style={styles.label}>{t('institution')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('institution')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterInstitution')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.institution && <Text style={styles.errorText}>{errors.institution.message}</Text>}
                        </>
                    )}
                    name="institution"
                />

                <Text style={styles.label}>{t('phoneNumber')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('phoneNumber')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterPhoneNumber')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="phone-pad"
                            />
                            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
                        </>
                    )}
                    name="phoneNumber"
                />


                <Text style={styles.label}>{t('position')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('position')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterPosition')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.position && <Text style={styles.errorText}>{errors.position.message}</Text>}
                        </>
                    )}
                    name="position"
                />

                <Text style={styles.label}>{t('nationality')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('nationality')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterNationality')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.nationality && <Text style={styles.errorText}>{errors.nationality.message}</Text>}
                        </>
                    )}
                    name="nationality"
                />

                <Text style={styles.label}>{t('passportNumber')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('passportNumber')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterPassportNumber')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.passportNumber && <Text style={styles.errorText}>{errors.passportNumber.message}</Text>}
                        </>
                    )}
                    name="passportNumber"
                />

                <Text style={styles.label}>{t('cityOfDeparture')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('cityOfDeparture')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterCityOfDeparture')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.cityOfDeparture && <Text style={styles.errorText}>{errors.cityOfDeparture.message}</Text>}
                        </>
                    )}
                    name="cityOfDeparture"
                />

                <Text style={styles.label}>{t('arrivalCity')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('arrivalCity')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('enterArrivalCity')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.arrivalCity && <Text style={styles.errorText}>{errors.arrivalCity.message}</Text>}
                        </>
                    )}
                    name="arrivalCity"
                />

                <Text style={styles.label}>{t('dateOfArrival')}</Text>
                <Controller
                    control={control}
                    name="dateOfArrival"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity onPress={() => showDatePickerHandler('dateOfArrival')}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('dateOfArrival')}
                                    value={value}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            {showDatePickers.dateOfArrival && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => handleDateChange('dateOfArrival', selectedDate, onChange)}
                                />
                            )}
                        </>
                    )}
                />
                {errors.dateOfArrival && <Text style={styles.errorText}>{errors.dateOfArrival.message}</Text>}

                <Text style={styles.label}>{t('timeOfArrival')}</Text>
                <Controller
                    control={control}
                    name="timeOfArrival"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity onPress={() => showDatePicker('timeOfArrival', 'timeOfArrival')}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('timeOfArrival')}
                                    value={value ? value.toLocaleTimeString() : ''}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            {showDatePickers.timeOfArrival && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => handleTimeChange('timeOfArrival', selectedDate, onChange)}
                                />
                            )}
                        </>
                    )}
                />
                {errors.timeOfArrival && <Text style={styles.errorText}>{errors.timeOfArrival.message}</Text>}

                <Text style={styles.label}>{t('arrivalFlightNo')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('arrivalFlightNo')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('arrivalFlightNo')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.arrivalFlightNo && <Text style={styles.errorText}>{errors.arrivalFlightNo.message}</Text>}
                        </>
                    )}
                    name="arrivalFlightNo"
                />

                <Text style={styles.label}>{t('dateOfDeparture')}</Text>
                <Controller
                    control={control}
                    name="dateOfDeparture"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity onPress={() => showDatePickerHandler('dateOfDeparture')}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('dateOfDeparture')}
                                    value={value}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            {showDatePickers.dateOfDeparture && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => handleDateChange('dateOfDeparture', selectedDate, onChange)}
                                />
                            )}
                        </>
                    )}
                />
                {errors.dateOfDeparture && <Text style={styles.errorText}>{errors.dateOfDeparture.message}</Text>}

                <Text style={styles.label}>{t('timeOfDeparture')}</Text>
                <Controller
                    control={control}
                    name="timeOfDeparture"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity onPress={() => showDatePicker('timeOfDeparture', 'timeOfDeparture')}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('timeOfDeparture')}
                                    value={value ? value.toLocaleTimeString() : ''}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            {showDatePickers.timeOfDeparture && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => handleTimeChange('timeOfDeparture', selectedDate, onChange)}
                                />
                            )}
                        </>
                    )}
                />
                {errors.timeOfDeparture && <Text style={styles.errorText}>{errors.timeOfDeparture.message}</Text>}

                <Text style={styles.label}>{t('departureCity')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('departureCity')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('departureCity')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.departureCity && <Text style={styles.errorText}>{errors.departureCity.message}</Text>}
                        </>
                    )}
                    name="departureCity"
                />

                <Text style={styles.label}>{t('departureFlightNo')}</Text>
                <Controller
                    control={control}
                    rules={{ required: `${t('departureFlightNo')} ${t('required')}` }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                placeholder={t('departureFlightNo')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.departureFlightNo && <Text style={styles.errorText}>{errors.departureFlightNo.message}</Text>}
                        </>
                    )}
                    name="departureFlightNo"
                />
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>{loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : ('Submit')}</Text>
                </TouchableOpacity>


            </ScrollView>
            <TouchableOpacity
                style={styles.chatButton}
                onPress={openWhatsApp}
            >
                <Icon name="telegram" size={30} color="white" />
            </TouchableOpacity>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {

        padding: 20,
    },
    header: {
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
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonDisabled: {
        backgroundColor: '#555',
    },
    chatButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#0088cc',  
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        zIndex: 1000,
    },
});
