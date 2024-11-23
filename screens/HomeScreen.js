import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';

export default function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
                source={require('../assets/images/confrence.webp')} 
                style={styles.eventImage} 
                contentFit='cover' 
                contentPosition="top left"
            />

            <Text style={styles.headerText}>AGSN 2024 CONFERENCE</Text>
            <Text style={styles.subHeaderText}>
                Promoting Climate-Friendly Water and Energy-Efficient Small Scale Solar Irrigation Systems
            </Text>

            <View style={styles.featuredEvents}>
                <View style={styles.eventCard}>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventName}>Conference Objectives</Text>
                        <Text style={styles.eventDetails}>
                            The objectives of the conference are to facilitate knowledge exchange and networking among
                            participating countries of the African Green Store Network (AGSN).
                        </Text>
                        <Text style={styles.eventDetails}>
                            Additionally, the workshop will explore the opportunities and challenges presented by small scale,
                            climate-friendly, water and energy-efficient solar irrigation system technology on the continent
                            and globally.
                        </Text>
                        <Text style={styles.eventDetails}>
                            The conference will further foster collaboration and allow stakeholders to explore available
                            opportunities. The conference will offer a sustainable solution to smallholder farmers'
                            productivity challenges, promote food security, and contribute to the Sustainable Development Goals.
                        </Text>
                    </View>

                    <View style={styles.eventInfo}>
                        <Text style={styles.eventName}>Expected Participants</Text>
                        <Text style={styles.eventDetails}>
                            Managers in charge of developing courses at the training center and establishments who are responsible
                            for integrating the new modules and discussing the strategies of their center and the AGSN.
                            {'\n\n'}
                            Experts or specialists with the following qualifications:
                            {'\n\n'}
                            - Speaker or teacher in a Network member establishment.
                            {'\n'}
                            - Specialist, researcher, or professional in solar energy agriculture.
                            {'\n'}
                            - Experienced staff or experts in irrigation systems and technologies.
                            {'\n'}
                            - Specialist in program development and implementation of solar energy and irrigation systems.
                        </Text>
                    </View>

                    <View style={styles.eventInfo}>
                        <Text style={styles.eventName}>Conference Activities</Text>
                        <Text style={styles.eventDetails}>
                            - Plenary session{'\n'}
                            - Field trip{'\n'}
                            - Syndicate group{'\n'}
                            - Anchoring of SPIS innovation with curricular of training center of AGSN{'\n'}
                            - Opportunities for TVets and Green Colleges{'\n'}
                            - Development of short courses on SPIS{'\n'}
                            - Country-specific sustainability model for SPIS{'\n'}
                            - Community testimonials{'\n'}
                            - Networking
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    eventCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
        elevation: 2,
        padding: 15,
    },
    eventImage: {
        width: '100%',
        height: 200,  
        borderRadius: 15,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    featuredEvents: {
        width: '100%',
    },
    eventInfo: {
        marginBottom: 10,
    },
    eventName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },
    eventDetails: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 10,
        textAlign: 'justify',
    },
});