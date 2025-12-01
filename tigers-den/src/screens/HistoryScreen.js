import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

const HistoryScreen = ({ navigation }) => {
    const { orderHistory } = useApp();
    const [syncedOrders, setSyncedOrders] = useState([]);

    useEffect(() => {
        // Sync local order history with Firebase to get updated statuses
        const syncOrders = async () => {
            const ordersRef = ref(database, 'orders');

            onValue(ordersRef, (snapshot) => {
                const firebaseOrders = snapshot.val();
                if (firebaseOrders && orderHistory.length > 0) {
                    // Update local orders with Firebase data
                    const updated = orderHistory.map(localOrder => {
                        const firebaseOrder = firebaseOrders[localOrder.id];
                        if (firebaseOrder) {
                            return {
                                ...localOrder,
                                status: firebaseOrder.status,
                                declineReason: firebaseOrder.declineReason
                            };
                        }
                        return localOrder;
                    });
                    setSyncedOrders(updated);
                } else {
                    setSyncedOrders(orderHistory);
                }
            });
        };

        syncOrders();

        return () => {
            const ordersRef = ref(database, 'orders');
            off(ordersRef);
        };
    }, [orderHistory]);

    const displayOrders = syncedOrders.length > 0 ? syncedOrders : orderHistory;

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Order History" transparent />

                {displayOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <GlassCard style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No past orders.</Text>
                        </GlassCard>
                    </View>
                ) : (
                    <FlatList
                        data={displayOrders}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => (
                            <GlassCard style={styles.orderCard}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.date}>{item.time}</Text>
                                    <Text style={styles.total}>₹{item.total.toFixed(2)}</Text>
                                </View>
                                <View style={styles.divider} />
                                {item.items.map((food, idx) => (
                                    <View key={idx}>
                                        <Text style={styles.itemText}>
                                            {food.qty}x {food.name}
                                        </Text>
                                        {food.instructions ? (
                                            <Text style={styles.instructionText}>Note: {food.instructions}</Text>
                                        ) : null}
                                    </View>
                                ))}
                                <View style={[
                                    styles.statusBadge,
                                    item.status === 'declined' && styles.declinedBadge,
                                    (!item.status || item.status === 'ready') && styles.completedBadge
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        item.status === 'declined' && styles.declinedText
                                    ]}>
                                        {item.status === 'declined' ? 'Declined' : 'Completed'}
                                    </Text>
                                </View>
                                {item.status === 'declined' && item.declineReason && (
                                    <Text style={styles.declineReasonText}>
                                        Reason: {item.declineReason}
                                    </Text>
                                )}
                            </GlassCard>
                        )}
                    />
                )}
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyCard: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.white,
        fontSize: 18,
    },
    orderCard: {
        padding: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    date: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    total: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 18,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 8,
    },
    itemText: {
        color: COLORS.white,
        fontSize: 15,
        marginBottom: 4,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 4,
        marginLeft: 10,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(34, 197, 94, 0.2)', // Green tint
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    completedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    declinedBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    statusText: {
        color: '#4ade80', // Light green
        fontSize: 12,
        fontWeight: 'bold',
    },
    declinedText: {
        color: '#ef4444', // Red
    },
    declineReasonText: {
        color: 'rgba(239, 68, 68, 0.8)',
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 8,
    },
});

export default HistoryScreen;
