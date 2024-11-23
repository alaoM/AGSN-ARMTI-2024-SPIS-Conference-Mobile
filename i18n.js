 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './assets/locales/en.json';
import fr from './assets/locales/fr.json';

// Define supported languages and their translations
const resources = {
    en: { translation: en },
    fr: { translation: fr },
};

// Function to get the initial language based on saved preference or device locale
const getInitialLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem('language'); 
        if (savedLanguage) {
            return savedLanguage;
        }
        // Default to device locale if no saved language
        const deviceLocale = Localization.locale;
        return deviceLocale.startsWith('fr') ? 'fr' : 'en';
    } catch (error) {
        console.error('Error loading language:', error);
        return 'en'; // Fallback in case of error
    }
};

// Initialize i18next
const initI18n = async () => {
    const initialLanguage = await getInitialLanguage();

  
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: initialLanguage, // Set initial language
            fallbackLng: 'en', // Fallback to English if language not found
            interpolation: {
                escapeValue: false, // React already safes from XSS
            },
            compatibilityJSON: 'v3',
        });
};

initI18n();

// Function to change language and persist the choice
const changeLanguage = async (lng) => { 
    try {
        await i18n.changeLanguage(lng);
        await AsyncStorage.setItem('language', lng);
    } catch (error) {
        console.error('Error changing language:', error);
    }
}; 
export default i18n;
export { changeLanguage };
