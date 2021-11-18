// basic example
export interface CounterState {
    data : number;
    title: string;
}

const initialState:CounterState = {
    data: 42,
    title: 'redux counter example'
}

// actions are dispatched to reducers to change their state
export default function counterReducer(state = initialState, action: any){
    return state;
}