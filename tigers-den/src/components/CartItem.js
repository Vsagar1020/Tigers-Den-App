import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

const CartItem = ({ item, onIncrement, onDecrement }) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={() => onDecrement(item.name)} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.qty}</Text>

                <TouchableOpacity onPress={() => onIncrement(item.name)} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        color: COLORS.gold,
        fontSize: 14,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 4,
    },
    button: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    qty: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
});

export default CartItem;
