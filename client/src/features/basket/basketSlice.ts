import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import {Basket} from "../../app/models/basket";


interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

// returns a function and creates action types for us
// quantity? means its optional, set to 1 by default
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    'basket/addBasketItemAsync',
    async ({productId, quantity=1}) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error) {
            console.log(error);
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        },
        removeItem: (state, action) => {
            const {productId, quantity} = action.payload;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity;

            // remove it if quantity is 0
            if (state.basket?.items[itemIndex].quantity === 0)
                state.basket.items.splice(itemIndex, 1);
        }

    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending,
            (state, action) => {
                //console.log(action);
                state.status = 'pendingAddItem' + action.meta.arg.productId;
            })
        builder.addCase(addBasketItemAsync.fulfilled,
            (state, action) => {
                state.basket = action.payload;
                state.status = 'idle';
            })
        builder.addCase(addBasketItemAsync.rejected, (state) => {
            state.status = 'idle';
        })
    })
})

export const {setBasket, removeItem} = basketSlice.actions;


