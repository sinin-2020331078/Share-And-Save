import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Helper function to create a unique cart item ID
  const createCartItemId = (item) => {
    // Determine the product type based on the item properties
    let productType = 'unknown';
    if (item.is_free) {
      productType = 'free';
    } else if (item.discount_price) {
      productType = 'discount';
    } else if (item.expiry_date) {
      productType = 'food';
    }
    return `${productType}_${item.id}`;
  };

  useEffect(() => {
    // Load cart items from localStorage on initial load
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // Calculate total
      const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotal(newTotal);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    if (!item || !item.id) {
      console.error('Invalid item added to cart:', item);
      return;
    }

    setCartItems(prevItems => {
      // Create a unique cart item ID that includes the product type
      const cartItemId = createCartItemId(item);
      
      // Check if item already exists in cart using the unique ID
      const existingItemIndex = prevItems.findIndex(i => createCartItemId(i) === cartItemId);
      
      if (existingItemIndex !== -1) {
        // Item exists, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add it as new
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => createCartItemId(item) !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        createCartItemId(item) === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 