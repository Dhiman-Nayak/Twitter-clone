import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    OptStart(state) {
      state.loading = true;
    },
    OptSuccess(state) {
      state.loading = false;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    OptFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { OptStart, OptSuccess, loginSuccess, OptFailure, logout } = userSlice.actions;
export default userSlice.reducer;
