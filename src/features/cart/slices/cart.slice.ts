/* eslint-disable @typescript-eslint/no-shadow */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state: {cart: any[]},
      action: PayloadAction<Omit<CartItem, 'quantity'>>,
    ) => {
      const itemInCart = state.cart.find(
        (item: {id: any}) => item.id === action.payload.id,
      );

      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state.cart.push({...action.payload, quantity: 1});
      }
    },
    incrementQuantity: (
      state: {cart: any[]},
      action: PayloadAction<number>,
    ) => {
      const item = state.cart.find(
        (item: {id: any}) => item.id === action.payload,
      );
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (
      state: {cart: any[]},
      action: PayloadAction<number>,
    ) => {
      const item = state.cart.find(
        (item: {id: any}) => item.id === action.payload,
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    removeFromCart: (state: {cart: any[]}, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(
        (item: {id: any}) => item.id !== action.payload,
      );
    },
    clearCart: state => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCart = (state: {cart: CartState}) => state.cart.cart;

export default cartSlice.reducer;
