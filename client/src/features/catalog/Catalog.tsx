import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent";

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // we have centralised axios withinapp api agent
        agent.Catalog.list().then(products => setProducts(products))
    }, []) // 2nd param, an empty array means the useEffect is called only once, 
    // if there is no 2nd param then useffects run every time a re-render happens

    
    
    return (//Fragment shorthand <> 
        <>
            <ProductList products={products}/>
        </>
    )
}