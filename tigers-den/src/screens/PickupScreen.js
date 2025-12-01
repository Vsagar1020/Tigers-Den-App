import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import QRCode from 'react-native-qrcode-svg';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

const PickupScreen = ({ navigation }) => {
    const { lastOrder } = useApp();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (!lastOrder) return;

        console.log('Setting up Firebase listener for order:', lastOrder.id);
        const orderRef = ref(database, `orders/${lastOrder.id}/verified`);

        const unsubscribe = onValue(orderRef, (snapshot) => {
            console.log('Firebase snapshot received:', snapshot.val());
            if (snapshot.val() === true) {
                console.log('Order verified!');
                setVerified(true);
            }
        });

        return () => {
            console.log('Cleaning up Firebase listener');
            off(orderRef);
        };
    }, [lastOrder]);

    if (!lastOrder) {
        return (
            <Background>
                <SafeAreaView style={styles.container}>
                    <Header title="Receipt" showBack={false} transparent />

                    {verified && (
                        <GlassCard style={styles.verifiedBanner}>
                            <Text style={styles.verifiedTitle}>✅ Order Verified!</Text>
                            <Text style={styles.verifiedText}>Your order has been confirmed by staff</Text>
                            <Button
                                title="Go Home"
                                onPress={() => navigation.navigate('Home')}
                                variant="gold"
                                style={styles.homeButton}
                            />
                        </GlassCard>
                    )}

                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <GlassCard style={styles.messageCard}>
                            <Text style={styles.text}>No active order.</Text>
                            <Button title="Go Home" onPress={() => navigation.navigate('Home')} />
                        </GlassCard>
                    </ScrollView>
                </SafeAreaView>
            </Background>
        );
    }

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Pickup Receipt" showBack={false} transparent />

                <ScrollView contentContainerStyle={styles.content}>
                    <GlassCard style={styles.receipt}>
                        <View style={styles.receiptHeader}>
                            <View>
                                <Text style={styles.receiptTitle}>Tigers Den</Text>
                                <Text style={styles.receiptSubtitle}>Pickup Receipt</Text>
                                <Text style={styles.receiptMeta}>Student: {lastOrder.name}</Text>
                            </View>
                            <View style={styles.badgeContainer}>
                                <View style={styles.orderBadge}>
                                    <Text style={styles.orderBadgeText}>{lastOrder.number}</Text>
                                </View>
                                <Text style={styles.receiptMeta}>{lastOrder.time}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {lastOrder.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemText}>{item.name} <Text style={styles.qtyText}>x{item.qty}</Text></Text>
                                    {item.instructions ? (
                                        <Text style={styles.instructionText}>Note: {item.instructions}</Text>
                                    ) : null}
                                </View>
                                <Text style={styles.itemPrice}>₹{(item.price * item.qty).toFixed(2)}</Text>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₹{lastOrder.total.toFixed(2)}</Text>
                        </View>

                        <Text style={styles.instruction}>Please show this receipt to the pickup counter to collect your order.</Text>

                        <View style={styles.footer}>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={JSON.stringify({
                                        id: lastOrder.id,
                                        number: lastOrder.number,
                                        name: lastOrder.name
                                    })}
                                    size={90}
                                    color={COLORS.black}
                                    backgroundColor={COLORS.gold}
                                />
                            </View>
                            <View style={styles.actions}>
                                <Button
                                    title="Rate Order"
                                    onPress={() => navigation.replace('Rate')}
                                    variant="gold"
                                    style={styles.actionButton}
                                />
                                <Button
                                    title="Done"
                                    onPress={() => navigation.popToTop()}
                                    variant="black"
                                    style={[styles.actionButton, { borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1 }]}
                                />
                            </View>
                        </View>
                    </GlassCard>
                </ScrollView>
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        padding: 16,
    },
    messageCard: {
        padding: 30,
        alignItems: 'center',
        gap: 20,
    },
    text: {
        color: COLORS.white,
        fontSize: 18,
    },
    receipt: {
        padding: 24,
    },
    receiptHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    receiptTitle: {
        color: COLORS.gold,
        fontSize: 24,
        fontWeight: 'bold',
    },
    receiptSubtitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    receiptMeta: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    badgeContainer: {
        alignItems: 'flex-end',
    },
    orderBadge: {
        backgroundColor: COLORS.gold,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 6,
    },
    orderBadgeText: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemText: {
        color: COLORS.white,
        fontSize: 16,
    },
    qtyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 2,
    },
    itemPrice: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    totalLabel: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalValue: {
        color: COLORS.gold,
        fontSize: 22,
        fontWeight: 'bold',
    },
    instruction: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        marginTop: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 24,
        alignItems: 'center',
        gap: 16,
    },
    qrContainer: {
        padding: 5,
        backgroundColor: COLORS.gold,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        flex: 1,
        gap: 10,
    },
    actionButton: {
        paddingVertical: 12,
    },
    verifiedBanner: {
        margin: 20,
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderColor: 'rgba(74, 222, 128, 0.3)',
    },
    verifiedTitle: {
        color: '#4ade80',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    verifiedText: {
        color: COLORS.white,
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    homeButton: {
        width: '100%',
    },
});

export default PickupScreen;
