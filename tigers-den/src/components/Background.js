import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

const Background = ({ children }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                // Background Gradient: Deep Black -> Dark Blue -> Deep Purple
                colors={['#000000', '#0f172a', '#1e1b4b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Background;
