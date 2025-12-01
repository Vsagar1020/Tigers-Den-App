import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const Button = ({ title, onPress, variant = 'gold', style, disabled }) => {
    const getBackgroundColor = () => {
        if (disabled) return COLORS.lightGray;
        switch (variant) {
            case 'black': return COLORS.black;
            case 'red': return COLORS.red;
            case 'gold': default: return COLORS.gold;
        }
    };

    const getTextColor = () => {
        if (disabled) return COLORS.darkGray;
        switch (variant) {
            case 'black': return COLORS.white;
            case 'red': return COLORS.white;
            case 'gold': default: return COLORS.black;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
