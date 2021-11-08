import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

// we don't need an addItem as whenever an item is added to the basket
// as we get the basket via setBasket
interface StoreContextValue {
    basket: Basket|null;     // | can be null
    setBasket:(basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

// default value is undefined


export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// custom react hook to work with storeContext

/**
 * provides basket, setBasket, removeItem
 */
export function useStoreContext() {
    const context = useContext(StoreContext);
    
    if(context === undefined){
        throw Error('oops we do not seem to be inside the provider');
    }
    
    return context;
}


export function StoreProvider({children}:PropsWithChildren<any>) {
    // create store and methods
    const[basket,setBasket] = useState<Basket|null>(null);
    
    function removeItem(productId: number, quantity: number){
        if(!basket) return;
        
        // copy state into items using the spread operator
        // React way is to not mutate state
        const items = [...basket.items];
        
        // return -1 if no item found
        const itemIndex = items.findIndex(i=>i.productId === productId);
        
        // on removal either reduce the qty or reduce qty and remove basket item
        if(itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity === 0)items.splice(itemIndex,1)
            setBasket(prevState => {
                return {...prevState!, items} //! overrides type safety possible error warning on prevState
            })
        }
    }
    
    
    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}