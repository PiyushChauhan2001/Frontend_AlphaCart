import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { getApiUrl, MOCK_PRODUCTS } from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [total, setTotal] = useState(0);

  // Sync total whenever cartItems changes
  useEffect(() => {
    const calculatedTotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.product_price || item.price || 0);
      return acc + price * (item.quantity || 1);
    }, 0);
    setTotal(calculatedTotal);
    try {
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // Fetch Cart from Backend with Fallback
  const fetchCart = async () => {
    try {
      const url = getApiUrl("/api/cart/");
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setCartItems(data.items);
          if (typeof data.total === "number") setTotal(data.total);
          return;
        }
      }
    } catch (error) {
      console.warn("Backend cart sync unavailable, using local cart state.", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add Product to Cart
  const addToCart = async (productId, productObject = null) => {
    try {
      const url = getApiUrl("/api/cart/add/");
      const res = await authFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });

      if (res.ok) {
        await fetchCart();
        return;
      }
    } catch (error) {
      console.warn("Backend add to cart failed, executing local add.", error);
    }

    // Local fallback logic for demo/offline/standalone deploy
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === productId || item.product_id === productId
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      } else {
        const targetProduct =
          productObject || MOCK_PRODUCTS.find((p) => p.id === productId);
        const newItem = {
          id: productId,
          product_id: productId,
          product_name: targetProduct ? targetProduct.name : `Product #${productId}`,
          product_price: targetProduct ? targetProduct.price : 99.99,
          product_image: targetProduct ? targetProduct.image : "",
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Remove Product from Cart
  const removeFromCart = async (itemId) => {
    try {
      const url = getApiUrl("/api/cart/remove/");
      await authFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      fetchCart();
    } catch (error) {
      console.warn("Backend remove from cart failed, executing local remove.", error);
    }

    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== itemId && item.product_id !== itemId
      )
    );
  };

  // Update Quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      const url = getApiUrl("/api/cart/update/");
      await authFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.warn("Backend update quantity failed, executing local update.", error);
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId || item.product_id === itemId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem("cart_items");
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
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);