import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const { accessToken, removeToken } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, [accessToken]);

    const fetchProfile = async () => {
        if (!accessToken) {
            setUserProfile(null);
            setLoadingProfile(false);
            return;
        }
        setLoadingProfile(true);
        try {
            const response = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.data) {
                setUserProfile(response.data);
            } else {
                setUserProfile(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response && error.response.status === 401) {
                // Token is invalid or expired
                removeToken();
            }
            setUserProfile(null);
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <ProfileContext.Provider value={{ userProfile, setUserProfile, loadingProfile, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);
