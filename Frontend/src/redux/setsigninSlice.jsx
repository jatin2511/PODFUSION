import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false
  };
  
  const signinSlice = createSlice({
    name: 'signin',
    initialState,
    reducers: {
      openSignin: (state) => {
        state.open = true;
      },
      closeSignin: (state) => {
        state.open = false;
      },
    },
  });
  
  export const { openSignin, closeSignin } = signinSlice.actions;
  export default signinSlice.reducer;