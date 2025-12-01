import React, { useRef, useState } from 'react';
import { View, SectionList, StyleSheet, SafeAreaView, Text, Animated, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import MenuItem from '../components/MenuItem';
import Background from '../components/Background';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const MenuScreen = ({ navigation }) => {
    const { menuData, addToCart, cart } = useApp();

    // Animation Value for Cart Icon
    const cartScale = useRef(new Animated.Value(1)).current;

    // Flying Items State
    const [flyingItems, setFlyingItems] = useState([]);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const triggerCartAnimation = () => {
        Animated.sequence([
            Animated.timing(cartScale, {
                toValue: 1.5,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.spring(cartScale, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleAddWithCoords = (item, coords) => {
        addToCart(item);

        const newItem = {
            id: Date.now(),
            animX: new Animated.Value(coords.x),
            animY: new Animated.Value(coords.y),
            opacity: new Animated.Value(1),
            scale: new Animated.Value(1),
        };

        setFlyingItems(prev => [...prev, newItem]);

        // Animate
        Animated.parallel([
            Animated.timing(newItem.animX, {
                toValue: width - 40, // Cart icon X (approx)
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(newItem.animY, {
                toValue: 40, // Cart icon Y (approx)
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(newItem.scale, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(newItem.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Cleanup
            setFlyingItems(prev => prev.filter(i => i.id !== newItem.id));
            triggerCartAnimation();
        });
    };

    const CartIcon = () => (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Animated.View style={[styles.cartIcon, { transform: [{ scale: cartScale }] }]}>
                <Text style={styles.cartEmoji}>🛒</Text>
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );

    // Group menu items by category and filter by search query
    const groupedMenu = menuData.reduce((acc, item) => {
        // Filter by search query
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return acc;

        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    // Define category order
    const categoryOrder = [
        'Breakfast',
        'Sandwiches',
        'Burgers',
        'Fried Chicken',
        'Sides',
        'Salads',
        'Pasta',
        'Noodles',
        'Sauces',
        'Desserts',
        'Drinks - Cold',
        'Tea',
        'Coffee',
        'Soup'
    ];

    // State for collapsed sections
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleSection = (title) => {
        setCollapsedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Create sections for SectionList
    const sections = categoryOrder
        .filter(category => groupedMenu[category])
        .map(category => ({
            title: category,
            data: collapsedSections[category] ? [] : groupedMenu[category]
        }));

    const renderSectionHeader = ({ section: { title } }) => (
        <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(title)}
            activeOpacity={0.7}
        >
            <Text style={styles.sectionTitle}>{title}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <View style={styles.itemWrapper}>
            <MenuItem
                item={item}
                onAdd={(it, coords) => handleAddWithCoords(it, coords)}
                isGlass
            />
        </View>
    );

    const toggleAllSections = () => {
        const allCollapsed = categoryOrder.every(cat => collapsedSections[cat]);

        const newCollapsedState = {};
        categoryOrder.forEach(cat => {
            newCollapsedState[cat] = !allCollapsed;
        });

        setCollapsedSections(newCollapsedState);
    };

    const allSectionsCollapsed = categoryOrder.every(cat => collapsedSections[cat]);

    return (
        <Background>
            <SafeAreaView style={styles.safeArea}>
                <Header title="Menu" rightComponent={<CartIcon />} transparent />

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search menu items..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                style={styles.clearButton}
                            >
                                <Text style={styles.clearButtonText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <SectionList
                    sections={sections}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.list}
                    stickySectionHeadersEnabled={false}
                />

                {/* Minimize/Expand All Button */}
                <View style={styles.floatingButtonContainer}>
                    <TouchableOpacity
                        style={styles.minimizeButton}
                        onPress={toggleAllSections}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.minimizeButtonText}>
                            {allSectionsCollapsed ? 'Expand All' : 'Minimize All'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Render Flying Items */}
                {flyingItems.map(item => (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.flyingItem,
                            {
                                transform: [
                                    { translateX: item.animX },
                                    { translateY: item.animY },
                                    { scale: item.scale }
                                ],
                                opacity: item.opacity
                            }
                        ]}
                    >
                        <Text style={{ fontSize: 24 }}>🍔</Text>
                    </Animated.View>
                ))}
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    searchBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.white,
        fontSize: 16,
        padding: 0,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    clearButtonText: {
        color: COLORS.gold,
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
        paddingBottom: 80, // Add padding for floating button
    },
    itemWrapper: {
        marginBottom: 16,
    },
    sectionHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cartIcon: {
        position: 'relative',
        padding: 4,
        zIndex: 20,
    },
    cartEmoji: {
        fontSize: 28,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.red,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.black,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    flyingItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        pointerEvents: 'none',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 50,
    },
    minimizeButton: {
        backgroundColor: COLORS.gold,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    minimizeButtonText: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MenuScreen;
