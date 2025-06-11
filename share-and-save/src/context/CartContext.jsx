import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Helper function to create a unique cart item ID
  const createCartItemId = (item) => {
    // Use the explicit type field if available, otherwise fallback to property-based detection
    let productType = item.type || 'unknown';
    if (productType === 'unknown') {
      if (item.is_free) {
        productType = 'free';
      } else if (item.discount_price) {
        productType = 'discount';
      } else if (item.expiry_date) {
        productType = 'food';
      }
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
    const cartItemId = createCartItemId(item);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => createCartItemId(i) === cartItemId);
      if (existingItem) {
        toast.info(`${item.title} quantity updated in cart!`, {
          position: "top-right",
          autoClose: 2000,
        });
        return prevItems.map(i => 
          createCartItemId(i) === cartItemId 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      // Set price to 0 for free products
      const price = item.type === 'free' ? 0 : item.price;
      toast.success(`${item.title} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
      return [...prevItems, { ...item, price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find(i => createCartItemId(i) === itemId);
    if (item) {
      toast.info(`${item.title} removed from cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setCartItems(prevItems => prevItems.filter(item => createCartItemId(item) !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        createCartItemId(item) === itemId ? { ...item, quantity } : item
      );
      const updatedItem = updatedItems.find(item => createCartItemId(item) === itemId);
      if (updatedItem) {
        toast.info(`${updatedItem.title} quantity updated to ${quantity}!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    toast.info("Cart cleared!", {
      position: "top-right",
      autoClose: 2000,
    });
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