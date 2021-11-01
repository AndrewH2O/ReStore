import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import {useEffect, useState} from "react";

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('https://localhost:5001/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, []) // 2nd param, an empty array means the useEffect is called only once, 
    // if there is no 2nd param then useffects run every time a re-render happens

    
    
    return (//Fragment shorthand <> 
        <>
            <ProductList products={products}/>
        </>
    )
}