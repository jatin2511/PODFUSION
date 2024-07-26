import { createSlice } from '@reduxjs/toolkit';
import { lightTheme } from '../utils/Themes';

const initialState = {
  currentTheme: lightTheme, // Default to light theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;