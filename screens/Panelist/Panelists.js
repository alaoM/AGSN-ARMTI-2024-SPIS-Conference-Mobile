import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView,  RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { API_URL } from '@env';
const Panelists = ({ route }) => {
    const { t } = useTranslation();
    const { panelist } = route.params;


    const [refreshing, setRefreshing] = useState(false);
    const [panelistData, setPanelistData] = useState(panelist);

    const onRefresh = async () => {
        setRefreshing(true);

        try {

            const updatedPanelist = {
                ...panelistData,
                bio: panelistData.bio,
            };
            setPanelistData(updatedPanelist);
        } catch (error) {
            console.error("Error refreshing panelist data:", error);
        } finally {
            setRefreshing(false);
        }
    };


    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >

            <Image source={{ uri: `${API_URL}${panelistData.imageUrl}` }} style={styles.panelistImage} contentFit='cover' contentPosition='center'/>
            <View style={styles.info}>
                <Text style={styles.name}>{panelistData.name}</Text>
                {
                    panelistData?.institution !== "" && <Text style={styles.department}>
                        {panelistData.institution}
                    </Text>
                }
                {
                    panelistData?.disposition !== "" && <Text style={styles.disposition}>
                        {panelistData.disposition}
                    </Text>
                }

                {
                    panelistData?.bio !== "" &&

                    <>
                        <Text style={styles.bioHeader}>{t('biography')}</Text>
                        <Text style={styles.bio}>
                            {panelistData.bio}
                        </Text>
                    </>
                }

            </View>
        </ScrollView>
    );
};

export default Panelists;

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
    panelistImage: {   
            width: '100%',
            height: 400,  
            borderRadius: 8,
            marginBottom: 16      
    },
    info: {
        paddingHorizontal: 5,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bioHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#000',
    },
    department: {
        fontSize: 16,
        color: '#777',
        marginBottom: 5,
        textAlign: "justify"
    },
    disposition: {
        fontSize: 16,
        color: '#777',
        marginBottom: 16,
        textAlign: "justify"
    },
    bio: {
        fontSize: 16,
        marginTop: 8,
    },
});
