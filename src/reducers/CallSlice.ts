import { createSlice } from '@reduxjs/toolkit';

interface CallState {
    callActive: boolean;
    isCaller: boolean;
}

const initialState: CallState = {
    callActive: false,
    isCaller: false,
};

const call = createSlice({
    name: 'call',
    initialState,
    reducers: {
        startCall(state) {
            state.callActive = true;
            state.isCaller = true;
        },
        receiveCall(state) {
            state.callActive = true;
            state.isCaller = false;
        },
        endCall(state) {
            state.callActive = false;
            state.isCaller = false;
        },
    },
});

export const { startCall, receiveCall, endCall } = call.actions;
export default call.reducer;