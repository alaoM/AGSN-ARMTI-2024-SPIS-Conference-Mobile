import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import speaker2 from "../../assets/images/speaker2.jpg"
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';

const SpeakerTwo = ({ speaker }) => {
    const { t } = useTranslation();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.speakersContainer}>
            <Image source={speaker2} style={styles.eventImage} contentFit='cover' contentPosition='center'/>
                <View style={styles.eventInfo}>
                    <Text style={styles.name}>Prof J.O Olaoye</Text>
                    <Text style={styles.institution}>
                        Department of Agricultural and Biosystems Engineering
                    </Text>
                    <Text style={styles.department}>
                        University of Ilorin, Kwara State
                    </Text>
                    <Text style={styles.bioHeader}>{t('biography')}</Text>
                    <Text style={styles.bioText}>
                        {t('speakerTwop1')}
                    </Text>
                    <Text style={styles.bioText}>
                        {t('speakerTwop2')}
                    </Text>
                    <Text style={styles.bioText}>
                        {t('speakerTwop3')}
                    </Text>
                    <Text style={styles.bioText}>
                        {t('speakerTwop4')}
                    </Text>
                </View>
            </View>

        </ScrollView>
    );
};

export default SpeakerTwo;

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
        marginHorizontal:10,
        width: '95%',
        height: 400, 
        borderRadius:15,
        marginBottom: 20
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
