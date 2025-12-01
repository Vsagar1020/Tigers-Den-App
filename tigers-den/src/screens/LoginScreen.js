import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const LoginScreen = ({ navigation }) => {
    const { loginUser } = useApp();
    const [pin, setPin] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [biometricType, setBiometricType] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadAccounts();
        }, [])
    );

    const loadAccounts = async () => {
        try {
            const accountsStr = await AsyncStorage.getItem('accounts');
            if (accountsStr) {
                const accountsList = JSON.parse(accountsStr);
                setAccounts(accountsList);
            } else {
                setAccounts([]);
            }
            checkBiometrics();
        } catch (e) {
            console.error("Failed to load accounts", e);
        } finally {
            setLoading(false);
        }
    };

    const checkBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometricType('Face ID');
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometricType('Touch ID');
            } else {
                setBiometricType('Biometrics');
            }
        } else {
            setBiometricType(null);
        }
    };

    const authenticateBiometric = async () => {
        if (!selectedAccount) {
            Alert.alert('Error', 'Please select an account first');
            return;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Login as ${selectedAccount.name}`,
                fallbackLabel: 'Cancel',
                disableDeviceFallback: false,
            });

            if (result.success) {
                loginUser(selectedAccount);
                navigation.replace('Home');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePinLogin = () => {
        if (!selectedAccount) {
            Alert.alert('Error', 'Please select an account first');
            return;
        }

        if (pin === selectedAccount.pin) {
            loginUser(selectedAccount);
            navigation.replace('Home');
        } else {
            Alert.alert('Error', 'Incorrect PIN');
            setPin('');
        }
    };

    const renderAccountItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.accountItem,
                selectedAccount?.studentId === item.studentId && styles.accountItemSelected
            ]}
            onPress={() => setSelectedAccount(item)}
        >
            <View style={styles.accountAvatar}>
                <Text style={styles.accountInitials}>
                    {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
            </View>
            <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{item.name}</Text>
                <Text style={styles.accountId}>ID: {item.studentId}</Text>
            </View>
            {selectedAccount?.studentId === item.studentId && (
                <Text style={styles.checkmark}>✓</Text>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <Background>
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}></View>
                </SafeAreaView>
            </Background>
        );
    }

    if (accounts.length === 0) {
        return (
            <Background>
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <GlassCard style={styles.card}>
                            <Text style={styles.title}>Welcome</Text>
                            <Text style={styles.subtitle}>No accounts found.</Text>
                            <Button
                                title="Create Account"
                                onPress={() => navigation.navigate('Register')}
                                variant="gold"
                            />
                        </GlassCard>
                    </View>
                </SafeAreaView>
            </Background>
        );
    }

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <GlassCard style={styles.card}>
                        <Text style={styles.title}>Select Account</Text>

                        <FlatList
                            data={accounts}
                            renderItem={renderAccountItem}
                            keyExtractor={(item) => item.studentId}
                            style={styles.accountsList}
                            contentContainerStyle={styles.accountsListContent}
                        />

                        {selectedAccount && (
                            <>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Enter PIN</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={pin}
                                        onChangeText={setPin}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        secureTextEntry
                                        placeholder="****"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                    />
                                </View>

                                <Button
                                    title="Login"
                                    onPress={handlePinLogin}
                                    variant="gold"
                                    style={styles.button}
                                />

                                {biometricType && (
                                    <TouchableOpacity onPress={authenticateBiometric} style={styles.faceIdButton}>
                                        <Text style={styles.faceIdText}>Login with {biometricType}</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            style={styles.createButton}
                        >
                            <Text style={styles.createText}>+ Create New Account</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            </SafeAreaView>
        </Background>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        padding: 32,
        alignItems: 'center',
        maxHeight: '80%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textGold,
        marginBottom: 32,
    },
    accountsList: {
        width: '100%',
        maxHeight: 200,
        marginBottom: 20,
    },
    accountsListContent: {
        gap: 12,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    accountItemSelected: {
        borderColor: COLORS.gold,
        backgroundColor: 'rgba(212,175,55,0.1)',
    },
    accountAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.gold,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountInitials: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    accountId: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    checkmark: {
        color: COLORS.gold,
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        color: COLORS.white,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 16,
        color: COLORS.white,
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    button: {
        width: '100%',
        marginBottom: 16,
    },
    faceIdButton: {
        padding: 12,
        marginTop: 8,
    },
    faceIdText: {
        color: COLORS.gold,
        fontSize: 16,
        fontWeight: '600',
    },
    createButton: {
        marginTop: 20,
        padding: 12,
    },
    createText: {
        color: COLORS.gold,
        fontSize: 16,
        fontWeight: '600',
    },
    biometricHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
});

export default LoginScreen;
