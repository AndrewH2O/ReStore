import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { counterSlice } from "../../features/contact/counterSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
})

// for ease of use
// avoids in contact page having to specify CounterState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>(); // typed to store dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // store state