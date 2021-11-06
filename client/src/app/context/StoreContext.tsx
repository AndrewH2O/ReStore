import { createContext } from "react";
import { Basket } from "../models/basket";

// we don't need an addItem as whenever an item is added to the basket
// we get the basket via setBasket
interface StoreContextValue {
    basket: Basket|null;
    setBasket:(basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);