import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { BlurView } from 'expo-blur';

const Header = ({ title, showBack = true, rightComponent, transparent }) => {
    const navigation = useNavigation();

    const HeaderContent = () => (
        <View style={[styles.container, transparent && styles.transparentContainer]}>
            {showBack ? (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.spacer} />
            )}

            <Text style={styles.title}>{title}</Text>

            <View style={styles.rightContainer}>
                {rightComponent || <View style={styles.spacer} />}
            </View>
        </View>
    );

    if (transparent) {
        return (
            <BlurView intensity={50} tint="dark" style={styles.blurWrapper}>
                <HeaderContent />
            </BlurView>
        );
    }

    return <HeaderContent />;
};

const styles = StyleSheet.create({
    blurWrapper: {
        zIndex: 100,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.black,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    transparentContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
    },
    backButton: {
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    backText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    rightContainer: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    spacer: {
        width: 40,
    },
});

export default Header;
