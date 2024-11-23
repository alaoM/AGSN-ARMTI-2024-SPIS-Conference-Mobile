import { StyleSheet, Text, View,  ScrollView } from 'react-native';
import React from 'react';
import speaker1 from "../../assets/images/speaker1.jpg"
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
const SpeakerOne = ({ speaker }) => {
    const { t } = useTranslation();
    return (
        <ScrollView style={styles.container}>
            <Image source={speaker1} style={styles.eventImage} contentFit='cover' contentPosition='left top'/>
            <View style={styles.eventInfo}>
                <Text style={styles.name}>Prof. John Jiha Musa</Text>
                <Text style={styles.institution}>
                    School of Infrastructure, Process Engineering and Technology,
                    Department of Agricultural and Bioresources Engineering
                </Text>
                <Text style={styles.department}>
                    Federal University of Technology, Minna, Niger State.
                </Text>
                <Text style={styles.bioHeader}>{t('biography')}</Text>
                <Text style={styles.bioText}>
                    {t('speakerOnep1')}
                </Text>
                <Text style={styles.bioText}>
                    {t('speakerOnep2')}
                </Text>
                <Text style={styles.bioText}>
                    {t('speakerOnep3')}
                </Text>
                <Text style={styles.bioText}>
                    {t('speakerOnep4')}
                </Text>
            </View>
        </ScrollView>
    );
};

export default SpeakerOne;

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
        textAlign: "justify"
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
