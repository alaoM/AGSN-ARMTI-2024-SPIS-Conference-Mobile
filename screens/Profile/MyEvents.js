import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { formatDate } from '../../assets/libs/helper';
import { useAuth } from '../../contextProviders/AuthContext';
export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = useAuth();
    
                
    useEffect(() => {
        const fetchEvents = async () => {
            try {
               
                if (!accessToken) {
                    throw new Error('No access token found');
                }
 
                const response = await axios.get(`${API_URL}/event-registrations/my-registrations`, {
                    headers: {
                        Authorization: `Bearer ${accessToken.accessToken}`,
                    },
                });
                console.error(response.data)
                if (response.data && response.data.length > 0) {
                    setEvents(response.data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (events.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noEventsText}>No events registered yet.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {events.map((registration) => (
                <View style={styles.card} key={registration.id}>
                    
                   <Image source={{ uri: `${API_URL}/${registration.event.imageUrl}` }} style={styles.image}  />  
                   <View style={styles.info}>
                        <Text style={styles.name}>{registration.event.name}</Text>
                        <Text style={styles.location}>{registration.event.location}</Text>
                        <Text style={styles.dateRange}>
                            {`${formatDate(registration.event.startingDate)} - ${formatDate(registration.event.closingDate)}`}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        width: '100%',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    info: {
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    price: {
        fontSize: 14,
        color: '#28a745',
    },
    noEventsText: {
        fontSize: 18,
        color: '#777',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
