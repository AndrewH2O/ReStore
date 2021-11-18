// basic example

// actions
export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";

export interface CounterState {
    data : number;
    title: string;
}

const initialState:CounterState = {
    data: 42,
    title: 'redux counter example'
}

// actions are dispatched to reducers to change their state
// these are the actions and how they create state changes from copying previous state 
// then updating the properties that change
export default function counterReducer(state = initialState, action: any){
    switch (action.type) {
        case INCREMENT_COUNTER:
            return {
                // cannot mutate state e.g. state.data + 1 
                // instead create a new copy
                // use spread operator to copy the override data with new value
                ...state,
                data: state.data + 1
            }
            break;
        case DECREMENT_COUNTER:
            return {
                ...state,
                data: state.data - 1
            }
            break;
        default:
            return state; // always return state
    }
    
   
   
    return state;
}