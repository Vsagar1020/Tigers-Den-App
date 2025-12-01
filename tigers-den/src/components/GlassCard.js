import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const GlassCard = ({ children, style, intensity = 20 }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fallback / Tint
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    blur: {
        width: '100%',
        // height: '100%', // Removed to allow auto-height based on content
    },
    content: {
        padding: 16,
    },
});

export default GlassCard;
