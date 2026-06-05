import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { createDebouncedCartSync } from './debouncedCartSync';

const CartContext = createContext(null);

const INITIAL_STATE = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map(i => {
          if (i.productId !== action.payload) return i;
          if (i.stock !== undefined && i.qty >= i.stock) return i;
          return { ...i, qty: i.qty + 1 };
        }),
      };
    }
    case 'DECREMENT': {
      const target = state.items.find(i => i.productId === action.payload);
      if (target && target.qty <= 1) {
        return { ...state, items: state.items.filter(i => i.productId !== action.payload) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.productId !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.productId !== action.payload.productId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId ? { ...i, qty: action.payload.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children, firestore, userId }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const syncRef = useRef(null);

  useEffect(() => {
    if (!firestore || !userId) return;
    syncRef.current = createDebouncedCartSync(firestore, userId, 500);
    return () => { syncRef.current?.cancel(); };
  }, [firestore, userId]);

  useEffect(() => {
    if (!syncRef.current || !userId) return;
    syncRef.current.sync(state.items);
  }, [state.items, userId]);

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const increment = useCallback((productId) => dispatch({ type: 'INCREMENT', payload: productId }), []);
  const decrement = useCallback((productId) => dispatch({ type: 'DECREMENT', payload: productId }), []);
  const removeItem = useCallback((productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }), []);
  const updateQty = useCallback((productId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { productId, qty } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const setCart = useCallback((items) => dispatch({ type: 'SET_CART', payload: items }), []);

  return (
    <CartContext.Provider value={{ ...state, addItem, increment, decrement, removeItem, updateQty, clearCart, openCart, closeCart, toggleCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
