import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [lastOrder, setLastOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Complete Tigers Den Menu organized by categories
    const [menuData, setMenuData] = useState([
        // BREAKFAST - CHOICE OF OMELETTE WITH TOAST (7:30AM-11AM)
        {
            id: 1,
            name: "Bacon or Ham Omelette",
            price: 260,
            rating: 0,
            ratingCount: 0,
            category: "Breakfast",
            description: "Contains Pork",
            variants: [
                { label: 'Bacon', price: 260 },
                { label: 'Ham', price: 260 }
            ]
        },
        { id: 2, name: "Chicken Omelette", price: 220, rating: 0, ratingCount: 0, category: "Breakfast", description: "Omelette with chicken" },
        { id: 3, name: "Egg White Omelette", price: 220, rating: 0, ratingCount: 0, category: "Breakfast", description: "Healthy egg white omelette" },
        {
            id: 4,
            name: "Masala/Mix Veg/Mushroom/Cheese",
            price: 190,
            rating: 0,
            ratingCount: 0,
            category: "Breakfast",
            description: "Vegetarian omelette options",
            variants: [
                { label: 'Masala', price: 190 },
                { label: 'Mix Veg', price: 190 },
                { label: 'Mushroom', price: 190 },
                { label: 'Cheese', price: 190 }
            ]
        },
        { id: 5, name: "Plain Omelette", price: 150, rating: 0, ratingCount: 0, category: "Breakfast", description: "Classic plain omelette" },
        {
            id: 6,
            name: "Sausages/Bacon",
            price: 150,
            rating: 0,
            ratingCount: 0,
            category: "Breakfast",
            description: "Side of sausages or bacon",
            variants: [
                { label: 'Sausages', price: 150 },
                { label: 'Bacon', price: 150 }
            ]
        },
        { id: 7, name: "Moong Dal Chilla with Paneer", price: 200, rating: 0, ratingCount: 0, category: "Breakfast", description: "Savory moong dal pancakes with paneer" },

        // BREAKFAST - CHOICE OF CEREAL WITH YOGURT/MILK
        { id: 8, name: "Muesli with Yogurt and Fruits", price: 230, rating: 0, ratingCount: 0, category: "Breakfast", description: "Healthy muesli bowl" },
        { id: 9, name: "Porridge", price: 200, rating: 0, ratingCount: 0, category: "Breakfast", description: "Water/Milk - Add nuts if you like" },
        { id: 10, name: "Seasonal Fresh Fruits", price: 230, rating: 0, ratingCount: 0, category: "Breakfast", description: "Fresh seasonal fruit platter" },
        {
            id: 11,
            name: "Butter Toast",
            price: 50,
            rating: 0,
            ratingCount: 0,
            category: "Breakfast",
            description: "Classic butter toast",
            variants: [
                { label: 'Plain', price: 50 },
                { label: 'With Cheese', price: 80 }
            ]
        },
        { id: 12, name: "Bacon, Egg, Cheese, Bagel", price: 360, rating: 0, ratingCount: 0, category: "Breakfast", description: "Hearty breakfast bagel" },
        { id: 13, name: "Bagel with Cream Cheese", price: 200, rating: 0, ratingCount: 0, category: "Breakfast", description: "Classic bagel with cream cheese" },
        { id: 14, name: "Bagel, Cream Cheese and Egg", price: 280, rating: 0, ratingCount: 0, category: "Breakfast", description: "Bagel with cream cheese and egg" },

        // SANDWICH/OTHERS (FROM 11 AM)
        { id: 22, name: "BLT (Bacon, Lettuce, Tomato)", price: 320, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Classic BLT sandwich" },
        { id: 221, name: "Ham Sandwich", price: 320, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Classic ham sandwich" },
        { id: 222, name: "Tuna Sandwich", price: 320, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Fresh tuna sandwich" },
        {
            id: 23,
            name: "Chicken Sandwich",
            price: 240,
            rating: 0,
            ratingCount: 0,
            category: "Sandwiches",
            description: "Grilled, Tikka, or Teriyaki style",
            variants: [
                { label: 'Grilled', price: 240 },
                { label: 'Tikka', price: 240 },
                { label: 'Teriyaki', price: 240 }
            ]
        },
        {
            id: 24,
            name: "Classic Sandwich",
            price: 160,
            rating: 0,
            ratingCount: 0,
            category: "Sandwiches",
            description: "PBJ, Cheese, or Egg Salad",
            variants: [
                { label: 'Peanut Butter Jelly', price: 160 },
                { label: 'Cheese', price: 160 },
                { label: 'Egg Salad', price: 160 }
            ]
        },
        { id: 25, name: "Roasted Vegetables Sandwich", price: 220, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Healthy roasted veg sandwich" },
        { id: 26, name: "Mozzarella Tomato Basil Sandwich", price: 240, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Fresh mozzarella and tomato basil" },
        { id: 27, name: "Cajun Spiced Cottage Cheese", price: 220, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Spicy cottage cheese sandwich" },
        { id: 28, name: "Feta Balsamic Onion Jam", price: 280, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Gourmet sandwich" },
        { id: 29, name: "Falafal Sandwich", price: 240, rating: 0, ratingCount: 0, category: "Sandwiches", description: "Crispy falafel sandwich" },

        // OTHERS (Burgers, Fried Chicken, etc.)
        { id: 38, name: "Veg Burger", price: 210, rating: 0, ratingCount: 0, category: "Burgers", description: "Classic vegetable burger" },
        { id: 381, name: "Lamb Burger", price: 340, rating: 0, ratingCount: 0, category: "Burgers", description: "Juicy lamb burger" },
        { id: 39, name: "Fried Chicken with Fries", price: 290, rating: 0, ratingCount: 0, category: "Fried Chicken", description: "Fried chicken served with fries" },
        { id: 40, name: "Fried Chicken Burger/Sandwich", price: 290, rating: 0, ratingCount: 0, category: "Fried Chicken", description: "Fried chicken in a bun or bread" },
        { id: 41, name: "Falafal with Hummus", price: 170, rating: 0, ratingCount: 0, category: "Sides", description: "Falafel served with hummus" },
        {
            id: 42,
            name: "Fried Rice",
            price: 220,
            rating: 0,
            ratingCount: 0,
            category: "Rice",
            description: "Veg or Chicken fried rice",
            variants: [
                { label: 'Veg', price: 220 },
                { label: 'Chicken', price: 260 }
            ]
        },
        {
            id: 43,
            name: "Noodles",
            price: 220,
            rating: 0,
            ratingCount: 0,
            category: "Noodles",
            description: "Veg or Chicken noodles",
            variants: [
                { label: 'Veg', price: 220 },
                { label: 'Chicken', price: 260 }
            ]
        },
        { id: 44, name: "French Fries", price: 100, rating: 0, ratingCount: 0, category: "Sides", description: "Classic salted fries" },
        { id: 441, name: "Potato Wedges", price: 100, rating: 0, ratingCount: 0, category: "Sides", description: "Crispy potato wedges" },

        // SALADS (SUNDRIES FROM 11AM)
        { id: 30, name: "Fried Chicken Salad", price: 320, rating: 0, ratingCount: 0, category: "Salads", description: "Salad with fried chicken" },
        { id: 31, name: "Beetroot, Feta Salad", price: 310, rating: 0, ratingCount: 0, category: "Salads", description: "Contains nuts" },
        {
            id: 32,
            name: "Caesar Salad",
            price: 230,
            rating: 0,
            ratingCount: 0,
            category: "Salads",
            description: "Classic Caesar salad",
            variants: [
                { label: 'Veg', price: 230 },
                { label: 'Chicken', price: 300 }
            ]
        },
        {
            id: 33,
            name: "Balsamic Salad",
            price: 220,
            rating: 0,
            ratingCount: 0,
            category: "Salads",
            description: "Salad with balsamic dressing",
            variants: [
                { label: 'Veg', price: 220 },
                { label: 'Chicken', price: 300 }
            ]
        },
        { id: 34, name: "Roast Veg Salad", price: 260, rating: 0, ratingCount: 0, category: "Salads", description: "Roasted vegetable salad" },
        { id: 35, name: "Falafal Feta Salad", price: 320, rating: 0, ratingCount: 0, category: "Salads", description: "Falafel and feta salad" },
        { id: 36, name: "Tuna Salad", price: 340, rating: 0, ratingCount: 0, category: "Salads", description: "Fresh tuna salad" },

        // LIVE PASTA VARIETY (FROM 11 AM)
        { id: 45, name: "Mushroom & Bell Pepper Pasta", price: 240, rating: 0, ratingCount: 0, category: "Pasta", description: "Pasta with mushroom and bell pepper" },
        { id: 46, name: "Aglio Olio", price: 220, rating: 0, ratingCount: 0, category: "Pasta", description: "Classic garlic and oil pasta" },
        {
            id: 49,
            name: "Smoked Chicken/Sausage/Meat Sauce Pasta",
            price: 300,
            rating: 0,
            ratingCount: 0,
            category: "Pasta",
            description: "Pasta with meat options",
            variants: [
                { label: 'Smoked Chicken', price: 300 },
                { label: 'Sausage', price: 300 },
                { label: 'Meat Sauce', price: 300 }
            ]
        },
        {
            id: 50,
            name: "Prawn/Bacon Pasta",
            price: 360,
            rating: 0,
            ratingCount: 0,
            category: "Pasta",
            description: "Pasta with prawn or bacon",
            variants: [
                { label: 'Prawn', price: 360 },
                { label: 'Bacon', price: 360 }
            ]
        },
        { id: 52, name: "Guacamole", price: 300, rating: 0, ratingCount: 0, category: "Pasta", description: "Fresh guacamole" },

        // CONFECTIONARY (DESSERTS)
        { id: 15, name: "Oats Cookies / Biscotti with Nuts", price: 140, rating: 0, ratingCount: 0, category: "Desserts", description: "Crunchy cookies" },
        { id: 16, name: "Dark Chocolate Chip Cookies", price: 140, rating: 0, ratingCount: 0, category: "Desserts", description: "Rich chocolate cookies" },
        {
            id: 17,
            name: "Peanut Butter/Chocolate Chip Cookies",
            price: 80,
            rating: 0,
            ratingCount: 0,
            category: "Desserts",
            description: "Classic cookies",
            variants: [
                { label: 'Peanut Butter', price: 80 },
                { label: 'Chocolate Chip', price: 80 }
            ]
        },
        { id: 18, name: "Caramel Popcorn", price: 70, rating: 0, ratingCount: 0, category: "Desserts", description: "Sweet popcorn" },
        { id: 19, name: "Plain Popcorn", price: 40, rating: 0, ratingCount: 0, category: "Desserts", description: "Salted popcorn" },
        { id: 20, name: "Brownie", price: 100, rating: 0, ratingCount: 0, category: "Desserts", description: "Chocolate brownie" },
        { id: 21, name: "Muffin", price: 100, rating: 0, ratingCount: 0, category: "Desserts", description: "Fresh muffin" },

        // DRINKS - COLD
        {
            id: 53,
            name: "Cold Coffee with Ice-Cream",
            price: 190,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Cold coffee topped with ice cream",
            variants: [
                { label: 'Small', price: 190 },
                { label: 'Large', price: 220 }
            ]
        },
        {
            id: 54,
            name: "Shakes",
            price: 190,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Chocolate, Banana, or Blueberry",
            variants: [
                { label: 'Small', price: 190 },
                { label: 'Large', price: 220 }
            ]
        },
        {
            id: 55,
            name: "Fresh Fruit Smoothies",
            price: 200,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Fresh fruit blend",
            variants: [
                { label: 'Small', price: 200 },
                { label: 'Large', price: 220 }
            ]
        },
        {
            id: 56,
            name: "Breakfast Smoothies",
            price: 220,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Healthy start",
            variants: [
                { label: 'Small', price: 220 },
                { label: 'Large', price: 250 }
            ]
        },
        { id: 57, name: "Vanilla Ice Cream Scoop", price: 90, rating: 0, ratingCount: 0, category: "Drinks - Cold", description: "Single scoop" },
        {
            id: 58,
            name: "Oat Milk Shakes",
            price: 230,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Dairy-free shakes",
            variants: [
                { label: 'Small', price: 230 },
                { label: 'Large', price: 270 }
            ]
        },
        {
            id: 59,
            name: "Oat Milk Smoothies",
            price: 230,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Dairy-free smoothies",
            variants: [
                { label: 'Small', price: 230 },
                { label: 'Large', price: 270 }
            ]
        },
        {
            id: 60,
            name: "Lemon Iced Tea",
            price: 90,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Refreshing tea",
            variants: [
                { label: 'Small', price: 90 },
                { label: 'Large', price: 120 }
            ]
        },
        {
            id: 61,
            name: "Lime Soda",
            price: 90,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Fresh lime soda",
            variants: [
                { label: 'Small', price: 90 },
                { label: 'Large', price: 120 }
            ]
        },
        {
            id: 62,
            name: "Lime Water",
            price: 70,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Fresh lime water",
            variants: [
                { label: 'Small', price: 70 },
                { label: 'Large', price: 90 }
            ]
        },
        {
            id: 63,
            name: "Refresher",
            price: 120,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Cooling drink",
            variants: [
                { label: 'Small', price: 120 },
                { label: 'Large', price: 160 }
            ]
        },
        {
            id: 64,
            name: "Virgin Mojito",
            price: 120,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Minty mocktail",
            variants: [
                { label: 'Small', price: 120 },
                { label: 'Large', price: 160 }
            ]
        },
        {
            id: 65,
            name: "Ginger Lemon Soda",
            price: 120,
            rating: 0,
            ratingCount: 0,
            category: "Drinks - Cold",
            description: "Spicy soda",
            variants: [
                { label: 'Small', price: 120 },
                { label: 'Large', price: 160 }
            ]
        },
        { id: 66, name: "Water Mineral/Sparkling", price: 50, rating: 0, ratingCount: 0, category: "Drinks - Cold", description: "Bottled water" },

        // TEA VARIETY
        { id: 67, name: "English Breakfast/Green Tea", price: 90, rating: 0, ratingCount: 0, category: "Tea", description: "Classic tea" },
        { id: 68, name: "Assam/Earl Grey/Green Tea", price: 90, rating: 0, ratingCount: 0, category: "Tea", description: "Premium tea selection" },
        { id: 69, name: "Darjeeling/Masala Tea", price: 90, rating: 0, ratingCount: 0, category: "Tea", description: "Aromatic tea" },
        { id: 70, name: "Chai Tea Latte", price: 200, rating: 0, ratingCount: 0, category: "Tea", description: "Spiced tea latte" },
        {
            id: 71,
            name: "Oat Drinks",
            price: 180,
            rating: 0,
            ratingCount: 0,
            category: "Tea",
            description: "Oat milk based drinks",
            variants: [
                { label: 'Small', price: 180 },
                { label: 'Large', price: 240 }
            ]
        },

        // COFFEE VARIETY
        {
            id: 72,
            name: "Cappuccino/Cafe Latte",
            price: 150,
            rating: 0,
            ratingCount: 0,
            category: "Coffee",
            description: "Espresso with milk",
            variants: [
                { label: 'Small', price: 150 },
                { label: 'Large', price: 200 }
            ]
        },
        {
            id: 73,
            name: "Cafe Mocha",
            price: 150,
            rating: 0,
            ratingCount: 0,
            category: "Coffee",
            description: "Chocolate coffee",
            variants: [
                { label: 'Small', price: 150 },
                { label: 'Large', price: 200 }
            ]
        },
        {
            id: 74,
            name: "Espresso/Americano",
            price: 100,
            rating: 0,
            ratingCount: 0,
            category: "Coffee",
            description: "Black coffee",
            variants: [
                { label: 'Small', price: 100 },
                { label: 'Large', price: 130 }
            ]
        },
        { id: 75, name: "Macchiato", price: 120, rating: 0, ratingCount: 0, category: "Coffee", description: "Espresso with foam" },
        {
            id: 76,
            name: "Hot Chocolate",
            price: 140,
            rating: 0,
            ratingCount: 0,
            category: "Coffee",
            description: "Rich hot cocoa",
            variants: [
                { label: 'Small', price: 140 },
                { label: 'Large', price: 200 }
            ]
        },
        { id: 77, name: "Extra Shot", price: 60, rating: 0, ratingCount: 0, category: "Coffee", description: "Add espresso shot" },
        { id: 78, name: "Add On Flavour", price: 70, rating: 0, ratingCount: 0, category: "Coffee", description: "Add syrup flavor" },

        // SOUP
        { id: 79, name: "Soup of the Day", price: 90, rating: 0, ratingCount: 0, category: "Soup", description: "Chef's special" }
    ]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const historyStr = await AsyncStorage.getItem('orderHistory');
            if (historyStr) {
                setOrderHistory(JSON.parse(historyStr));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const registerUser = async (userData) => {
        try {
            // Check if student ID already exists
            const accountsStr = await AsyncStorage.getItem('accounts');
            const accounts = accountsStr ? JSON.parse(accountsStr) : [];

            if (accounts.find(acc => acc.studentId === userData.studentId)) {
                Alert.alert('Error', 'An account with this Student ID already exists');
                return false;
            }

            // Set initial balance
            let initialBalance = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
            if (userData.name.toLowerCase().includes('vivaan')) {
                initialBalance = 0;
            }

            const newUser = { ...userData, balance: initialBalance };

            // Add to accounts array
            const updatedAccounts = [...accounts, newUser];
            await AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));

            return true;
        } catch (e) {
            console.error("Save failed", e);
            return false;
        }
    };

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const addBalance = async (amount) => {
        if (!user) return;

        const updatedUser = { ...user, balance: user.balance + amount };
        setUser(updatedUser);

        // Update in accounts array
        const accountsStr = await AsyncStorage.getItem('accounts');
        const accounts = accountsStr ? JSON.parse(accountsStr) : [];
        const updatedAccounts = accounts.map(acc =>
            acc.studentId === updatedUser.studentId ? updatedUser : acc
        );
        await AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i.name === item.name);
            if (existing) {
                // Check if adding one more would exceed the limit
                if (existing.qty >= 10) {
                    Alert.alert(
                        'Maximum Quantity Reached',
                        'You can only order up to 10 of each item.',
                        [{ text: 'OK' }]
                    );
                    return prevCart; // Don't add more
                }
                return prevCart.map(i =>
                    i.name === item.name ? { ...i, qty: i.qty + 1 } : i
                );
            } else {
                return [...prevCart, { ...item, qty: 1, instructions: '' }];
            }
        });
    };

    const updateQuantity = (name, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.name === name) {
                    const newQty = item.qty + change;
                    // Enforce maximum of 10 items
                    if (newQty > 10) {
                        Alert.alert(
                            'Maximum Quantity Reached',
                            'You can only order up to 10 of each item.',
                            [{ text: 'OK' }]
                        );
                        return item; // Keep current quantity
                    }
                    return { ...item, qty: Math.max(0, newQty) };
                }
                return item;
            }).filter(item => item.qty > 0);
        });
    };

    const updateInstruction = (name, text) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.name === name) {
                    return { ...item, instructions: text };
                }
                return item;
            });
        });
    };

    const clearCart = () => setCart([]);

    const placeOrder = async () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Allow negative balance (Credit system)
        // if (user && user.balance < total) {
        //   return { success: false, message: "Insufficient Balance" };
        // }

        // Deduct balance
        let updatedUser = { ...user };
        if (user) {
            updatedUser.balance -= total;
            setUser(updatedUser);

            // Update in accounts array
            const accountsStr = await AsyncStorage.getItem('accounts');
            const accounts = accountsStr ? JSON.parse(accountsStr) : [];
            const updatedAccounts = accounts.map(acc =>
                acc.studentId === updatedUser.studentId ? updatedUser : acc
            );
            await AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        }

        const order = {
            id: Date.now(),
            items: [...cart],
            name: user ? user.name : 'Guest',
            studentId: user ? user.studentId : 'N/A',
            number: 'TDR' + Math.floor(1000 + Math.random() * 9000),
            total: total,
            time: new Date().toLocaleString(),
            status: 'pending', // pending, approved, declined, preparing, ready
            declineReason: null,
        };

        // Save to Firebase
        try {
            const { database } = await import('../config/firebase');
            const { ref, set } = await import('firebase/database');
            const orderRef = ref(database, `orders/${order.id}`);
            await set(orderRef, order);
            console.log('Order saved to Firebase:', order.id);
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }

        setLastOrder(order);

        const newHistory = [order, ...orderHistory];
        setOrderHistory(newHistory);
        AsyncStorage.setItem('orderHistory', JSON.stringify(newHistory));

        clearCart();
        return { success: true, order };
    };

    const submitRating = (ratings) => {
        setMenuData(prevMenu => {
            return prevMenu.map(item => {
                if (ratings[item.name]) {
                    const userRating = ratings[item.name];
                    const currentRating = item.rating || 0;
                    const currentCount = item.ratingCount || 0;

                    // Calculate new weighted average
                    const newCount = currentCount + 1;
                    const newRating = ((currentRating * currentCount) + userRating) / newCount;

                    return {
                        ...item,
                        rating: parseFloat(newRating.toFixed(1)),
                        ratingCount: newCount
                    };
                }
                return item;
            });
        });
        setLastOrder(null);
    };

    return (
        <AppContext.Provider value={{
            cart,
            menuData,
            lastOrder,
            orderHistory,
            user,
            isLoading,
            registerUser,
            loginUser,
            logoutUser,
            addBalance,
            addToCart,
            updateQuantity,
            updateInstruction,
            placeOrder,
            submitRating,
            clearCart
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
