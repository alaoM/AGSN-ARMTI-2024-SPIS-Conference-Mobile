import { StyleSheet, Text, View,  ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import speaker3 from "../../assets/images/speaker3.jpg"
import speaker4 from "../../assets/images/speaker4.jpg"
const SpeakerThree = ({ speaker }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.speakersContainer}>
            <Image source={speaker3} style={styles.eventImage} contentFit='cover' contentPosition='center'/>
                <View style={styles.eventInfo}>
                    <Text style={styles.name}>Abdelouahid Fouia</Text>                
                    <Text style={styles.department}>
                    SPIS Master Trainer
                    </Text>
                </View>
            </View>
            <View>
            <Image source={speaker4} style={styles.eventImage} contentFit='cover' contentPosition='left top'/>
                <View style={styles.eventInfo}>
                    <Text style={styles.name}>Jean- Pierre SAYOUBA DJIELA</Text>  
                    <Text style={styles.institution}>
                    AGSN President
                    </Text>
                    <Text style={styles.department}>
                    CPF, Cameroon
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default SpeakerThree;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        marginVertical: 8,
    },
    speakersContainer: {
marginBottom: 24
    },
    eventImage: {
        width: '100%',
        height: 400,  
        borderRadius: 8,
        marginBottom: 16
    },
    eventInfo: {
        paddingHorizontal: 5,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    institution: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
        textAlign: 'justify'
    },
    department: {
        fontSize: 16,
        color: '#777',
        marginBottom: 16,
    },
    bioHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#000',
    },
    bioText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
        textAlign: 'justify',
    },
});
