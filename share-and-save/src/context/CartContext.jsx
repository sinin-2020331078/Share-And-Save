import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { token, isAuthenticated } = useAuth();

  // Helper function to create a unique cart item ID
  const createCartItemId = (item) => {
    return `${item.item_type}_${item.item_id}`;
  };

  // Fetch cart items from the backend
  const fetchCartItems = async () => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await axios.get('http://localhost:8000/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated, token]);

  useEffect(() => {
    // Calculate total whenever cart items change
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addToCart = async (item) => {
    if (!isAuthenticated || !token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const cartItem = {
        item_type: item.type,
        item_id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        quantity: 1,
        image_url: item.image_url || (item.image ? `http://localhost:8000${item.image}` : null)
      };

      const response = await axios.post(
        'http://localhost:8000/api/cart/',
        cartItem,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state with the response
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => createCartItemId(i) === createCartItemId(response.data));
        if (existingItem) {
          return prevItems.map(i => 
            createCartItemId(i) === createCartItemId(response.data) 
              ? response.data
              : i
          );
        }
        return [...prevItems, response.data];
      });

      toast.success(`${item.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated || !token) return;

    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.info('Item removed from cart!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated || !token || quantity < 1) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/cart/${itemId}/`,
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? response.data : item
        )
      );

      toast.info(`Quantity updated to ${quantity}!`);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !token) return;

    try {
      // Delete all cart items one by one
      await Promise.all(
        cartItems.map(item =>
          axios.delete(`http://localhost:8000/api/cart/${item.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );

      setCartItems([]);
      toast.info('Cart cleared!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
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