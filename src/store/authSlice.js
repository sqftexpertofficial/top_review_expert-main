import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isSignInModalOpen: false,
  isSignUpModalOpen: false,
  loading: true,
  business:[],
  selectedBusiness:{}
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.userData = action.payload;
    },
    updateSignInModalStatus: (state, action) => {
      state.isSignInModalOpen = action.payload;
    },
    updateSignUpModalStatus: (state, action) => {
      state.isSignUpModalOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBusiness: (state, action) => {
      state.business = action.payload; 
    },
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload; 
    },
  },
});

export const { setAuthState, updateSignInModalStatus, updateSignUpModalStatus, setLoading, setBusiness, setSelectedBusiness } = authSlice.actions;
export const authReducer = authSlice.reducer;
