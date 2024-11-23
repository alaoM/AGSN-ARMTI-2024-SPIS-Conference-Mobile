import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../SplashScreen/SplashScreen';
import SplashScreenTwo from '../SplashScreen/SplashScreenTwo';
import RegisterScreen from '../RegisterScreen/Registerscreen';
import MainDrawerNavigator from './MainDrawerNavigator';
import LoginScreen from '../LoginScreen/login';
import { useAuth } from '../../contextProviders/AuthContext';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { accessToken, loading } = useAuth();

  // If the auth state is still loading, show a loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={accessToken ? 'Main' : 'Splash'} screenOptions={{ headerShown: false }}>
        {accessToken ? (
          // User is logged in, navigate to MainTabNavigator
          <Stack.Screen name="Main" component={MainDrawerNavigator} />
        ) : (
          // User is not logged in, show the splash and auth screens
          <>
            <Stack.Screen name="SplashTwo" component={SplashScreenTwo} />
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
