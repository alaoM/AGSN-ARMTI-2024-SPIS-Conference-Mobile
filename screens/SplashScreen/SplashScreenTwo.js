import React, { useEffect } from 'react';
import { View, StyleSheet,} from 'react-native';
import { Image } from 'expo-image';

const SplashScreenTwo = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Splash');
        }, 3000);  
    }, [navigation]);

    return (
        <View style={styles.container}> 
            <Image source={require('../../assets/images/confrence.webp')} style={styles.image} contentFit='cover' contentPosition='center'/>     
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%', 
    },
});

export default SplashScreenTwo;
