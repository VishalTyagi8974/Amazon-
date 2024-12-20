import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = true;
        },

        logout: (state, action) => {
            state.token = false;
        }
    }
})


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;




