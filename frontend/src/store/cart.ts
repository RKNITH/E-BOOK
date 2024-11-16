import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Book } from "../components/BookDetail";
import { RootState } from ".";

export type cartItem =
  | {
      product: Book;
      quantity: number;
    }
  | CartItemAPI;

export interface CartItemAPI {
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    cover?: string;
    price: {
      mrp: string;
      sale: string;
    };
  };
}

export interface CartState {
  id?: string;
  items: cartItem[];
}

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartId(state, { payload }: PayloadAction<string>) {
      state.id = payload;
    },
    updateCartState(state, { payload }: PayloadAction<CartState>) {
      state.id = payload.id;
      state.items = payload.items;
    },
    updateCartItems(state, { payload }: PayloadAction<cartItem>) {
      // find if the user is creating cart for the first time
      // then find the product from the existing list
      const index = state.items.findIndex(
        (item) => item.product.id === payload.product.id
      );
      if (index === -1) {
        // if no product found update list with new product and its qty
        state.items.push(payload);
      } else {
        // if product is found update the qty
        // 1 += 1 = 2, 1 += -1 = 0
        state.items[index].quantity += payload.quantity;
        if (state.items[index].quantity <= 0) {
          // if qty becomes 0 remove the product from the cart
          state.items.splice(index, 1);
        }
      }
    },
  },
});

export const getCartState = createSelector(
  (state: RootState) => state,
  ({ cart }) => {
    return {
      totalCount: cart.items.reduce((total, cartItem) => {
        total += cartItem.quantity;
        return total;
      }, 0),
      subTotal: cart.items.reduce((total, cartItem) => {
        total += Number(cartItem.product.price.mrp) * cartItem.quantity;
        return total;
      }, 0),
      totalPrice: cart.items.reduce((total, cartItem) => {
        total += Number(cartItem.product.price.sale) * cartItem.quantity;
        return total;
      }, 0),
      ...cart,
    };
  }
);

export const { updateCartId, updateCartItems, updateCartState } = slice.actions;

export default slice.reducer;
