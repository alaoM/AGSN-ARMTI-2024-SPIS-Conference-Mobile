import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';  // Ensure this path is correct

const SplashScreen = ({ navigation }) => {
  const { i18n } = useTranslation();
 
  // const handleLanguageChange = async (lng) => {
  //   await changeLanguage(lng);
  //   navigation.replace('Login');
  // };

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);  
}, [navigation]);


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>AGSN-ARMTI 2024 SPIS Conference</Text>
      
    {/*   <View style={styles.languageContainer}>
        <Text style={styles.languageText}>Select your preferred language:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.languageButton, i18n.language === 'en' && styles.activeButton]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={styles.buttonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageButton, i18n.language === 'fr' && styles.activeButton]}
            onPress={() => handleLanguageChange('fr')}
          >
            <Text style={styles.buttonText}>Français</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2A38',  
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  languageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  languageButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#1E2A38',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#81b0ff',
  },
  spinner: {
    marginTop: 20,
  },
});

export default SplashScreen;
