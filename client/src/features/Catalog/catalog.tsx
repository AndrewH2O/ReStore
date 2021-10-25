import {Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

interface Props {
    products: Product[];
    addProduct: () => void;
}

// instead of props destructure Props into {products, addProduct}
export default function Catalog({products, addProduct}: Props) {
    return (//Fragment shorthand <> 
        <>
            <ProductList products={products}/>
            <Button variant='contained' onClick={addProduct}>Add product</Button>
        </>
    )
}