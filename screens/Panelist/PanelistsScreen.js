import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Panelists from './Panelists';
import { API_URL } from '@env';
import { useAuth } from '../../contextProviders/AuthContext';

const Tab = createMaterialTopTabNavigator();

const PanelistsScreen = () => {
    const [panelists, setPanelists] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [refreshing, setRefreshing] = useState(false);  
    const [error, setError] = useState(null);
    const accessToken = useAuth();

    const fetchPanelists = async () => {
        try {
            if (!accessToken) {
                throw new Error('No access token found');
            }
            const response = await fetch(`${API_URL}/panelists`, {
                headers: {
                    Authorization: `Bearer ${accessToken.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setPanelists(data);
                setError(null);
            } else {
                setPanelists([]);
                setError('No panelists have been uploaded yet.');
            }
        } catch (error) {
            console.error("Fetch error:", error.message);
            setError('Could not load panelists. Please try again later.');
            setPanelists([]); 
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPanelists();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPanelists();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
                <Text>Loading panelists...</Text>
            </View>
        );
    }

    if (error && panelists.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.container}>
                <Tab.Navigator>
                    {panelists.map((panelist, index) => (
                        <Tab.Screen
                            key={index}
                            name={`Panelist ${index + 1}`}
                            component={Panelists}
                            initialParams={{ panelist }}
                        />
                    ))}
                </Tab.Navigator>
            </View>
        </ScrollView>
    );
};

export default PanelistsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
