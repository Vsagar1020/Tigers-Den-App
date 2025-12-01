import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const ProfileScreen = ({ navigation }) => {
    const { user, logoutUser } = useApp();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        logoutUser();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };


    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete this account? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Remove from accounts array
                            const accountsStr = await AsyncStorage.getItem('accounts');
                            if (accountsStr) {
                                const accounts = JSON.parse(accountsStr);
                                const updatedAccounts = accounts.filter(
                                    acc => acc.studentId !== user.studentId
                                );
                                await AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
                            }

                            logoutUser();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert('Error', 'Failed to delete account');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Profile" transparent />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={100}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* User Info Card */}
                        <GlassCard style={styles.card}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
                            </View>
                            <Text style={styles.name}>{user?.name}</Text>
                            <Text style={styles.id}>ID: {user?.studentId}</Text>
                            <View style={styles.balanceBadge}>
                                <Text style={styles.balanceText}>Balance: ₹{user?.balance?.toFixed(2)}</Text>
                            </View>
                        </GlassCard>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <Button
                                title="Logout"
                                onPress={handleLogout}
                                variant="black"
                                style={styles.actionButton}
                            />

                            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
                                <Text style={styles.deleteText}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    card: {
        padding: 24,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.gold,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    id: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 16,
    },
    balanceBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    balanceText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 18,
    },
    sectionTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        width: '100%',
    },
    currency: {
        color: COLORS.white,
        fontSize: 20,
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: COLORS.white,
        fontSize: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    halfButton: {
        flex: 1,
    },
    addButton: {
        width: '100%',
    },
    actions: {
        marginTop: 20,
        gap: 16,
    },
    actionButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    deleteButton: {
        alignItems: 'center',
        padding: 12,
    },
    deleteText: {
        color: COLORS.red,
        fontSize: 14,
    },
});

export default ProfileScreen;
