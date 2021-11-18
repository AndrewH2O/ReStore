import { createSlice } from "@reduxjs/toolkit"


export interface CounterState {
    data : number;
    title: string;
}

const initialState:CounterState = {
    data: 42,
    title: 'redux counter example with the redux toolkit'
}

// action types and action creators are created for us 
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            // What? we are mutating state but inner workings of toolkit
            // use immer where immuatble states are created from mutable ones
            // so its ok
            state.data += action.payload;
        },
        decrement: (state, action) => {
            state.data -= action.payload;
        }
    }
})

export const  { increment, decrement } = counterSlice.actions;