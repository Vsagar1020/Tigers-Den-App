import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const RateScreen = ({ navigation }) => {
    const { lastOrder, submitRating } = useApp();
    const [ratings, setRatings] = useState({});

    if (!lastOrder) {
        return (
            <Background>
                <SafeAreaView style={styles.container}>
                    <Header title="Rate Your Order" showBack={false} transparent />
                    <View style={styles.centerContent}>
                        <GlassCard style={styles.card}>
                            <Text style={styles.text}>No order to rate.</Text>
                            <Button title="Go Home" onPress={() => navigation.navigate('Home')} />
                        </GlassCard>
                    </View>
                </SafeAreaView>
            </Background>
        );
    }

    const handleRate = (itemName, rating) => {
        setRatings(prev => ({ ...prev, [itemName]: rating }));
    };

    const handleSubmit = () => {
        submitRating(ratings);
        Alert.alert("Thank You", "Rating submitted!", [
            { text: "OK", onPress: () => navigation.popToTop() }
        ]);
    };

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Rate Your Order" showBack={false} transparent />

                <ScrollView contentContainerStyle={styles.content}>
                    <GlassCard style={styles.card}>
                        <Text style={styles.headerText}>How was your food?</Text>

                        {lastOrder.items.map((item, index) => (
                            <View key={index} style={styles.row}>
                                <View>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
                                </View>

                                <View style={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => handleRate(item.name, star)}>
                                            <Text style={[
                                                styles.star,
                                                (ratings[item.name] || 5) >= star && styles.filledStar
                                            ]}>
                                                ★
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </GlassCard>
                </ScrollView>

                <View style={styles.footer}>
                    <Button title="Submit Ratings" onPress={handleSubmit} variant="gold" style={styles.submitButton} />
                </View>
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
    card: {
        padding: 16,
    },
    headerText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    name: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    stars: {
        flexDirection: 'row',
        gap: 8,
    },
    star: {
        fontSize: 28,
        color: 'rgba(255,255,255,0.2)',
    },
    filledStar: {
        color: COLORS.gold,
    },
    footer: {
        padding: 16,
    },
    submitButton: {
        width: '100%',
        borderRadius: 30,
        paddingVertical: 16,
    },
});

export default RateScreen;
