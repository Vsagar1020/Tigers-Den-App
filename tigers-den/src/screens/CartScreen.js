import React from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

const CartScreen = ({ navigation }) => {
    const { cart, updateQuantity, placeOrder, user, updateInstruction } = useApp();

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const result = await placeOrder();
        if (result.success) {
            navigation.navigate('OrderStatus');
        } else {
            Alert.alert("Checkout Failed", result.message);
        }
    };

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Header title="Cart" transparent />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={100}
                >
                    {cart.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <GlassCard style={styles.emptyCard}>
                                <Text style={styles.emptyText}>Your cart is empty.</Text>
                            </GlassCard>
                        </View>
                    ) : (
                        <FlatList
                            data={cart}
                            keyExtractor={item => item.name}
                            renderItem={({ item }) => (
                                <View style={styles.itemWrapper}>
                                    <GlassCard>
                                        <CartItem
                                            item={item}
                                            onIncrement={(name) => updateQuantity(name, 1)}
                                            onDecrement={(name) => updateQuantity(name, -1)}
                                        />
                                        {/* Special Instructions Input */}
                                        <View style={styles.instructionContainer}>
                                            <Text style={styles.instructionLabel}>Special Instructions:</Text>
                                            <TextInput
                                                style={styles.instructionInput}
                                                placeholder="e.g. No mayo, extra spicy..."
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                value={item.instructions}
                                                onChangeText={(text) => updateInstruction(item.name, text)}
                                            />
                                        </View>
                                    </GlassCard>
                                </View>
                            )}
                            contentContainerStyle={styles.list}
                        />
                    )}

                    <View style={styles.footerWrapper}>
                        <GlassCard style={styles.footer}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                            </View>
                            <Button
                                title={`Pay ₹${total.toFixed(2)}`}
                                onPress={handleCheckout}
                                variant="gold"
                                disabled={cart.length === 0}
                                style={styles.checkoutButton}
                            />
                        </GlassCard>
                    </View>
                </KeyboardAvoidingView>
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
        paddingBottom: 100, // Space for footer
    },
    itemWrapper: {
        marginBottom: 12,
    },
    instructionContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    instructionLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 6,
    },
    instructionInput: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        padding: 10,
        color: COLORS.white,
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
        fontWeight: '500',
    },
    footerWrapper: {
        padding: 16,
    },
    footer: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '500',
    },
    totalValue: {
        color: COLORS.gold,
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(246, 197, 82, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    checkoutButton: {
        width: '100%',
    },
});

export default CartScreen;
