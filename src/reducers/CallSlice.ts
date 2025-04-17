import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallData {
    threadId: number;
    token: string;
    roomId: string;
    callerName: string;
    status: 'ringing' | 'accepted' | 'rejected' | 'ended';
}

interface CallState {
    callActive: boolean;
    isCaller: boolean;
    callData: CallData | null;
}

const initialState: CallState = {
    callActive: false,
    isCaller: false,
    callData: null,
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
            state.callData = null;
        },
        setCallData(state, action: PayloadAction<CallData>) {
            state.callData = action.payload;
        },
    },
});

export const { startCall, receiveCall, endCall, setCallData } = call.actions;
export default call.reducer;