import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
    const { user, lastOrder } = useApp();

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header Section */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Hello,</Text>
                            <Text style={styles.username}>{user?.name || 'Guest'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
                            <Text style={{ fontSize: 24 }}>👤</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Card Balance */}
                    <GlassCard style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Card Balance</Text>
                        <Text style={styles.balanceValue}>₹{user?.balance?.toFixed(2) || '0.00'}</Text>
                        <Text style={styles.balanceSub}>Available for food & drinks</Text>
                    </GlassCard>

                    {/* Featured / Daily Special */}
                    <Text style={styles.sectionTitle}>Daily Special</Text>
                    <GlassCard style={styles.featuredCard}>
                        <View style={styles.featuredContent}>
                            <Text style={styles.featuredTag}>TRENDING</Text>
                            <Text style={styles.featuredTitle}>Fried Chicken Burger</Text>
                            <Text style={styles.featuredDesc}>Crunchy chicken breast with lettuce, tomato, and mayo.</Text>
                            <Text style={styles.featuredPrice}>₹350</Text>
                        </View>
                        <View style={styles.featuredImagePlaceholder}>
                            <Text style={{ fontSize: 40 }}>🍔</Text>
                        </View>
                    </GlassCard>

                    {/* Quick Actions */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Menu')}
                        >
                            <GlassCard style={styles.actionCard}>
                                <Text style={styles.actionIcon}>🍽️</Text>
                                <Text style={styles.actionText}>Order Now</Text>
                            </GlassCard>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('History')}
                        >
                            <GlassCard style={styles.actionCard}>
                                <Text style={styles.actionIcon}>📜</Text>
                                <Text style={styles.actionText}>History</Text>
                            </GlassCard>
                        </TouchableOpacity>


                    </View>

                    {/* Active Order Banner */}
                    {lastOrder && (
                        <View style={styles.activeOrderSection}>
                            <Text style={styles.sectionTitle}>Active Order</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('OrderStatus')}>
                                <GlassCard style={styles.activeOrderCard}>
                                    <View style={styles.activeOrderInfo}>
                                        <Text style={styles.activeOrderTitle}>Order #{lastOrder.number}</Text>
                                        <Text style={styles.activeOrderStatus}>In Progress...</Text>
                                    </View>
                                    <View style={styles.activeOrderArrow}>
                                        <Text style={{ color: COLORS.gold, fontSize: 20 }}>→</Text>
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
    },
    username: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    balanceCard: {
        padding: 24,
        marginBottom: 30,
        backgroundColor: 'rgba(246, 197, 82, 0.15)', // Gold tint
        borderColor: 'rgba(246, 197, 82, 0.3)',
    },
    balanceLabel: {
        color: COLORS.textGold,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceValue: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    balanceSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    sectionTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    featuredCard: {
        flexDirection: 'row',
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    featuredContent: {
        flex: 1,
    },
    featuredTag: {
        color: COLORS.gold,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    featuredTitle: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featuredDesc: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        marginBottom: 10,
    },
    featuredPrice: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuredImagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 30,
    },
    actionButton: {
        flex: 1,
    },
    actionCard: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeOrderSection: {
        marginBottom: 20,
    },
    activeOrderCard: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(6, 182, 212, 0.15)', // Cyan tint
        borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    activeOrderTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18,
    },
    activeOrderStatus: {
        color: COLORS.cyan,
        fontSize: 14,
        marginTop: 2,
    },
});

export default HomeScreen;
