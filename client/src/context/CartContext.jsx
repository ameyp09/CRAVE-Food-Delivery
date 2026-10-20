import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('crave_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // When auth state changes, sync or load cart
  useEffect(() => {
    const fetchOrSyncCart = async () => {
      if (isAuthenticated && token) {
        try {
          const localItems = JSON.parse(localStorage.getItem('crave_cart') || '[]');
          if (localItems.length > 0) {
            // Sync guest cart to server
            const res = await api.post('/cart/sync', { items: localItems });
            if (res.data?.success && res.data.cart?.items) {
              setCartItems(res.data.cart.items);
            }
          } else {
            // Fetch user cart
            const res = await api.get('/cart');
            if (res.data?.success && res.data.cart?.items) {
              setCartItems(res.data.cart.items);
            }
          }
        } catch (err) {
          console.warn('Failed to sync/fetch cart:', err);
        }
      }
    };

    fetchOrSyncCart();
  }, [isAuthenticated, token]);

  // Persist local storage for guest
  useEffect(() => {
    localStorage.setItem('crave_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (food, qtyToAdd = 1) => {
    const foodId = food._id || food.id;

    // Optimistic UI update
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.food?._id || item.food) === foodId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd
        };
        return updated;
      } else {
        return [...prevItems, { food, quantity: qtyToAdd }];
      }
    });

    toast.success(`Added ${food.name} to cart! 🍽️`, {
      id: `cart-${foodId}`
    });

    // If logged in, sync with backend
    if (isAuthenticated) {
      try {
        await api.post('/cart/add', { foodId, quantity: qtyToAdd });
      } catch (err) {
        console.error('Backend cart add error:', err);
      }
    }
  };

  const updateQuantity = async (foodId, newQuantity) => {
    const validQty = Math.max(0, Number(newQuantity));

    setCartItems((prevItems) => {
      if (validQty === 0) {
        return prevItems.filter((item) => (item.food?._id || item.food) !== foodId);
      }
      return prevItems.map((item) => {
        if ((item.food?._id || item.food) === foodId) {
          return { ...item, quantity: validQty };
        }
        return item;
      });
    });

    if (isAuthenticated) {
      try {
        await api.put('/cart/update', { foodId, quantity: validQty });
      } catch (err) {
        console.error('Backend cart update error:', err);
      }
    }
  };

  const removeFromCart = async (foodId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.food?._id || item.food) !== foodId)
    );
    toast.success('Item removed from cart');

    if (isAuthenticated) {
      try {
        await api.delete(`/cart/item/${foodId}`);
      } catch (err) {
        console.error('Backend cart remove error:', err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('crave_cart');

    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Backend cart clear error:', err);
      }
    }
  };

  const getItemQuantity = (foodId) => {
    const item = cartItems.find((i) => (i.food?._id || i.food) === foodId);
    return item ? item.quantity : 0;
  };

  const applyPromoCode = (code) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'CRAVE20' || cleaned === 'CRAVE50' || cleaned === 'WELCOME') {
      const discount = cleaned === 'CRAVE50' ? 25 : 20;
      setPromoCode(cleaned);
      setDiscountPercent(discount);
      toast.success(`Promo code applied! Enjoy ${discount}% off 🎉`);
      return { success: true };
    } else {
      toast.error('Invalid promo code. Try "CRAVE20"');
      return { success: false };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    toast('Promo code removed');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.food?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discountAmount,
        discountPercent,
        grandTotal,
        promoCode,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
