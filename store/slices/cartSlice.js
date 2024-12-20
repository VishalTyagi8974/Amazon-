import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserCartData } from "../../utils/userFunctions";
import axios from "axios";
import conf from "../../conf/conf";

export const addOrUpdateItemToCart = createAsyncThunk("cart/addItem", async (item) => {
    const response = await axios.post(`${conf.baseUrl}/user/cart`, { cartItem: { product: item.product, quantity: item.quantity } }, { withCredentials: true });
    return response.data;
});

export const removeItemFromCart = createAsyncThunk("cart/removeItem", async (item) => {
    const response = await axios.delete(`${conf.baseUrl}/user/cart`, {
        data: { product: item.product }, // Pass product data this way
        withCredentials: true
    });
    return response.data;
});

export const fetchAndMergeCartItems = createAsyncThunk("cart/mergeItems", async (reduxCart) => {
    const response = await getUserCartData(); // Fetch existing cart from backend
    const existingCart = response.cart; // Handle case if response.cart is undefined
    const mergedCart = [...existingCart];

    reduxCart.forEach((storeItem) => {
        const existingItem = mergedCart.find(
            (cartItem) => cartItem.product._id === storeItem.product._id
        );

        if (!existingItem) {
            mergedCart.push(storeItem); // Add new items
        }
    });

    await axios.put(`${conf.baseUrl}/user/cart`, { cart: mergedCart }, { withCredentials: true });
    return mergedCart; // Return the merged cart

});

export const emptyCartItems = createAsyncThunk("cart/emptyCartItems", async () => {
    await axios.put(`${conf.baseUrl}/user/cart`, { cart: [] }, { withCredentials: true })
    return [];

});


const initialState = {
    cartList: [],
    isLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const existingItem = state.cartList.find((item) => item.product._id.toString() === action.payload.product._id.toString());
            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
            } else {
                state.cartList.push(action.payload);
            }
        },
        removeItem: (state, action) => {
            state.cartList = state.cartList.filter((cartItem) => action.payload.product._id !== cartItem.product._id);
        },

        clearCart: (state) => {
            state.cartList = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addOrUpdateItemToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addOrUpdateItemToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                const { cartItem } = action.payload;
                const existingItem = state.cartList.find(
                    (item) => item.product._id === cartItem.product._id
                );
                if (existingItem) {
                    existingItem.quantity = cartItem.quantity;
                } else {
                    state.cartList.push(cartItem);
                }
            })
            .addCase(addOrUpdateItemToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Use payload as error message
            })
            .addCase(removeItemFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                const { product } = action.payload;
                state.cartList = state.cartList.filter(
                    (item) => item.product._id.toString() !== product._id
                );
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Use payload as error message
            })
            .addCase(fetchAndMergeCartItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAndMergeCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartList = action.payload;
            })
            .addCase(fetchAndMergeCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Use payload as error message
            })
            .addCase(emptyCartItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(emptyCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartList = action.payload;
            })
            .addCase(emptyCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Use payload as error message
            });
    },

});

export const selectCartItems = (state) => state.cart.cartList;
export const selectCartTotalCost = (state) =>
    state.cart.cartList.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
