import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  isLoading: false,
};

const loading = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingState(state, { payload }) {
      console.log("loader payload", payload)
        state.isLoading = payload;
    },
  },
});

export const { setLoadingState } = loading.actions;
export default loading.reducer;