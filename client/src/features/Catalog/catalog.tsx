import { Product } from "../../app/models/product";

interface Props {
    products: Product[];
    addProduct: () => void;
}

// instead of props destructure Props into {products, addProduct}
export default function Catalog({products, addProduct}: Props) {
    return (//Fragment shorthand <> 
        <>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name} - {product.price}</li>
                ))}
            </ul>
            <button onClick={addProduct}>Add product</button>
        </>
    )
}