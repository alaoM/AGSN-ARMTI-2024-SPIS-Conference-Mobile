import React, { useEffect, useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setIsEnglish(savedLanguage === 'en');
      }
    };

    loadLanguage();
  }, []);

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? 'fr' : 'en'; 
    setIsEnglish(!isEnglish);
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.switchContainer}>
      <Text>{isEnglish ? 'English' : 'Français'}</Text>
      <Switch
        value={isEnglish}
        onValueChange={toggleLanguage}
        thumbColor={isEnglish ? "#f5dd4b" : "#f4f3f4"}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LanguageSwitcher;
