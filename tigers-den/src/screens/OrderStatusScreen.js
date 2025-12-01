import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

const OrderStatusScreen = ({ navigation }) => {
    const { lastOrder, user, loginUser } = useApp();
    const [status, setStatus] = useState('pending');
    const [declineReason, setDeclineReason] = useState(null);
    const [progress] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!lastOrder) {
            navigation.replace('Home');
            return;
        }

        console.log('Setting up Firebase listener for order:', lastOrder.id);
        const orderRef = ref(database, `orders/${lastOrder.id}`);

        const unsubscribe = onValue(orderRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log('Order status updated:', data.status);
                const previousStatus = status;
                setStatus(data.status);
                setDeclineReason(data.declineReason);

                // Handle status changes
                if (data.status === 'declined') {
                    // Refund the money if order was just declined
                    if (previousStatus !== 'declined') {
                        refundOrder(lastOrder);
                    }
                    // Show decline reason and go back
                    setTimeout(() => {
                        navigation.replace('Home');
                    }, 5000);
                } else if (data.status === 'approved') {
                    // Start preparing animation
                    animateProgress(0.5);
                } else if (data.status === 'ready') {
                    // Complete animation and navigate
                    animateProgress(1);
                    setTimeout(() => {
                        navigation.replace('Pickup');
                    }, 2000);
                }
            }
        });

        return () => {
            console.log('Cleaning up Firebase listener');
            off(orderRef);
        };
    }, [lastOrder]);

    const refundOrder = async (order) => {
        try {
            // Update balance in AsyncStorage
            const accountsStr = await AsyncStorage.getItem('accounts');
            if (accountsStr) {
                const accounts = JSON.parse(accountsStr);
                const updatedAccounts = accounts.map(acc => {
                    if (acc.studentId === order.studentId) {
                        return { ...acc, balance: acc.balance + order.total };
                    }
                    return acc;
                });
                await AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));

                // Update the current user's balance in context if it's the same user
                if (user && user.studentId === order.studentId) {
                    const updatedUser = { ...user, balance: user.balance + order.total };
                    loginUser(updatedUser); // This updates the context
                }

                console.log('Refunded ₹', order.total, 'to', order.studentId);
            }
        } catch (error) {
            console.error('Error refunding order:', error);
        }
    };

    const animateProgress = (toValue) => {
        Animated.timing(progress, {
            toValue,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'pending':
                return 'Waiting for staff approval...';
            case 'approved':
                return 'Your order is being prepared...';
            case 'ready':
                return 'Your order is ready!';
            case 'declined':
                return 'Order Declined';
            default:
                return 'Processing...';
        }
    };

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Order Status" showBack={false} transparent />

                <View style={styles.content}>
                    <GlassCard style={styles.card}>
                        <Text style={styles.orderNumber}>{lastOrder?.number}</Text>

                        <Text style={[
                            styles.statusText,
                            status === 'declined' && styles.declinedText
                        ]}>
                            {getStatusMessage()}
                        </Text>

                        {status === 'declined' && declineReason && (
                            <View style={styles.reasonCard}>
                                <Text style={styles.reasonLabel}>Reason:</Text>
                                <Text style={styles.reasonText}>{declineReason}</Text>
                            </View>
                        )}

                        {lastOrder && lastOrder.items && (
                            <View style={styles.itemsContainer}>
                                <Text style={styles.itemsTitle}>Your Order:</Text>
                                {lastOrder.items.map((item, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {item.qty}x {item.name}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {status !== 'declined' && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <Animated.View
                                        style={[
                                            styles.progressFill,
                                            { width: progressWidth }
                                        ]}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.stepsContainer}>
                            <View style={styles.step}>
                                <View style={[
                                    styles.stepDot,
                                    (status !== 'pending' && status !== 'declined') && styles.stepDotActive
                                ]} />
                                <Text style={styles.stepText}>Approved</Text>
                            </View>
                            <View style={styles.step}>
                                <View style={[
                                    styles.stepDot,
                                    status === 'ready' && styles.stepDotActive
                                ]} />
                                <Text style={styles.stepText}>Ready</Text>
                            </View>
                        </View>
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
        padding: 20,
    },
    card: {
        padding: 32,
        alignItems: 'center',
    },
    orderNumber: {
        color: COLORS.gold,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 32,
    },
    declinedText: {
        color: '#ef4444',
    },
    reasonCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        width: '100%',
    },
    reasonLabel: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    reasonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    itemsContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    itemsTitle: {
        color: COLORS.gold,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    itemText: {
        color: COLORS.white,
        fontSize: 15,
        marginBottom: 6,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 32,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.gold,
        borderRadius: 4,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    step: {
        alignItems: 'center',
    },
    stepDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 8,
    },
    stepDotActive: {
        backgroundColor: COLORS.gold,
    },
    stepText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
});

export default OrderStatusScreen;
