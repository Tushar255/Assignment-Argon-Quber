import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name: "authSlice",
    initialState: initialStateValues,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state, action) => {
            state.user = null;
            state.token = null;
        }
    }
})
export const { setLogin, setLogout } = authSlice.actions;
export default authSlice;