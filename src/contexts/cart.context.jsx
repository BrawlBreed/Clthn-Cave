import { createContext, useState, useEffect, useReducer } from 'react';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.title === productToAdd.title
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.title === productToAdd.title
        ? { ...cartItem, quantity: cartItem.quantity + productToAdd.quantity }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: productToAdd.quantity }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.title === cartItemToRemove.title
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.title !== cartItemToRemove.title);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.title === cartItemToRemove.title
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.title !== cartItemToClear.title);

export const CartContext = createContext({
  setIsCartOpen: () => { },
  addItemToCart: () => { },
  removeItemFromCart: () => { },
  clearItemFromCart: () => { },
  clearCart: () => { },
  cartState: {}
});

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0
}

const types = {
  addCartItem: 'addCartItem',
  removeCartItem: 'removeCartItem',
  clearCartItem: 'clearCartItem',
  cartCount: 'cartCount',
  cartTotal: 'cartTotal',
  openCloseCart: 'openCloseCart',
  clearCart: 'clearCart'
}

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case types.addCartItem:
      return { ...state, cartItems: addCartItem(state.cartItems, payload) }
    case types.removeCartItem:
      return { ...state, cartItems: removeCartItem(state.cartItems, payload) }
    case types.clearCartItem:
      return { ...state, cartItems: clearCartItem(state.cartItems, payload) }
    case types.cartCount:
      return { ...state, cartCount: payload }
    case types.cartTotal:
      return { ...state, cartTotal: payload }
    case types.openCloseCart:
      return { ...state, isCartOpen: !state.isCartOpen }
    case types.clearCart:
      return INITIAL_STATE
    default:
      console.log('Unknown error!')
  }

}

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(reducer, INITIAL_STATE)

  useEffect(() => {
    const newCartCount = cartState.cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    dispatch({ type: types.cartCount, payload: newCartCount });
  }, [cartState.cartItems]);

  useEffect(() => {
    const newCartTotal = cartState?.cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    dispatch({ type: types.cartTotal, payload: newCartTotal });
  }, [cartState.cartItems]);

  const addItemToCart = (productToAdd) => {
    dispatch({ type: types.addCartItem, payload: productToAdd })
  };

  const removeItemToCart = (cartItemToRemove) => {
    dispatch({ type: types.removeCartItem, payload: cartItemToRemove })
  };

  const clearItemFromCart = (cartItemToClear) => {
    dispatch({ type: types.clearCartItem, payload: cartItemToClear })
  };

  const setIsCartOpen = () => {
    dispatch({ type: types.openCloseCart })
  }

  const clearCart = () => {
    dispatch({ type: types.clearCart })
  }

  const value = {
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    setIsCartOpen,
    clearCart,
    cartState: cartState
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
