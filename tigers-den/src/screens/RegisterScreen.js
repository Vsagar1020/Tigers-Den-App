import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const RegisterScreen = ({ navigation }) => {
    const { registerUser } = useApp();
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [pin, setPin] = useState('');

    const handleRegister = async () => {
        if (!name || !studentId || !pin) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (pin.length < 4) {
            Alert.alert('Error', 'PIN must be at least 4 digits');
            return;
        }

        const success = await registerUser({ name, studentId, pin });
        if (success) {
            Alert.alert('Success', 'Account created!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Go back to Login screen so user can login with their new PIN
                        // We use reset to clear history so they can't go back to register
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]);
        } else {
            Alert.alert('Error', 'Failed to create account');
        }
    };

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <GlassCard style={styles.card}>
                        <Text style={styles.title}>Create Account</Text>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="John Doe"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Student ID</Text>
                                <TextInput
                                    style={styles.input}
                                    value={studentId}
                                    onChangeText={setStudentId}
                                    placeholder="12345678"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Create PIN (4 digits)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={pin}
                                    onChangeText={setPin}
                                    placeholder="****"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            variant="gold"
                            style={styles.button}
                        />

                        <Button
                            title="Cancel"
                            onPress={() => navigation.goBack()}
                            variant="black"
                            style={styles.cancelButton}
                        />
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 24,
        textAlign: 'center',
    },
    form: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 16,
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
        padding: 12,
        color: COLORS.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    button: {
        width: '100%',
        marginBottom: 12,
    },
    cancelButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});

export default RegisterScreen;
