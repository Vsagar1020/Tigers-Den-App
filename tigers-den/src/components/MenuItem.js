import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import GlassCard from './GlassCard';
import { COLORS } from '../constants/colors';

const MenuItem = ({ item, onAdd, isGlass }) => {
    const buttonRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);

    const handlePress = () => {
        if (item.variants && item.variants.length > 0) {
            setShowSizeModal(true);
        } else {
            addItemToCart(item);
        }
    };

    const addItemToCart = (itemToAdd) => {
        buttonRef.current?.measure((fx, fy, width, height, px, py) => {
            onAdd(itemToAdd, { x: px, y: py });
        });
    };

    const handleVariantSelect = (variant) => {
        setShowSizeModal(false);
        const itemWithVariant = {
            ...item,
            name: `${item.name} (${variant.label || variant.size})`,
            price: variant.price,
            selectedVariant: variant
        };
        // Small delay to allow modal to close before animation
        setTimeout(() => {
            addItemToCart(itemWithVariant);
        }, 100);
    };

    const renderStars = (rating) => {
        if (!rating || rating === 0) {
            return (
                <Text style={styles.notReviewed}>Not Reviewed</Text>
            );
        }
        return (
            <View style={styles.starsRow}>
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} style={[styles.star, star <= Math.round(rating) && styles.filledStar]}>
                            ★
                        </Text>
                    ))}
                </View>
                <Text style={styles.ratingCount}>({item.ratingCount || 0})</Text>
            </View>
        );
    };

    const Content = () => (
        <View style={styles.innerContainer}>
            <TouchableOpacity
                style={styles.info}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <Text style={styles.name}>{item.name}</Text>
                <Text
                    style={styles.description}
                    numberOfLines={expanded ? undefined : 2}
                >
                    {item.description}
                </Text>
                {renderStars(item.rating)}
                <Text style={styles.price}>
                    {item.variants ? `From ₹${item.variants[0].price}` : `₹${item.price.toFixed(2)}`}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                ref={buttonRef}
                onPress={handlePress}
                style={styles.addButton}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            {/* Size Selection Modal */}
            <Modal
                visible={showSizeModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSizeModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowSizeModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>
                                <Text style={styles.modalSubtitle}>{item.name}</Text>

                                <View style={styles.variantsContainer}>
                                    {item.variants?.map((variant, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.variantButton}
                                            onPress={() => handleVariantSelect(variant)}
                                        >
                                            <Text style={styles.variantName}>{variant.label || variant.size}</Text>
                                            <Text style={styles.variantPrice}>₹{variant.price}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowSizeModal(false)}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

    if (isGlass) {
        return (
            <GlassCard>
                <Content />
            </GlassCard>
        );
    }

    return (
        <View style={styles.container}>
            <Content />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.black,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    description: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 8,
        lineHeight: 16,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 6,
    },
    notReviewed: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    ratingCount: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    star: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        marginRight: 2,
    },
    filledStar: {
        color: COLORS.gold,
    },
    price: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: COLORS.gold,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        borderWidth: 1,
        borderColor: COLORS.gold,
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    variantsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    variantButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    variantName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    variantPrice: {
        color: COLORS.gold,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 12,
        alignItems: 'center',
    },
    cancelText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
});

export default MenuItem;
