import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderStatusScreen from '../screens/OrderStatusScreen';
import PickupScreen from '../screens/PickupScreen';
import RateScreen from '../screens/RateScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#000' }
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
            <Stack.Screen name="Pickup" component={PickupScreen} />
            <Stack.Screen name="Rate" component={RateScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
