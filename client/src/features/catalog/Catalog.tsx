import ProductList from "./ProductList";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {fetchProductsAsync, productSelectors } from "./catalogSlice";

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    
    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync())
    }, [productsLoaded, dispatch]) 
    // 2nd param, an empty array means the useEffect is called only once, 
    // if there is no 2nd param then useffects run every time a re-render happens

    if(status.includes('pending')) return <LoadingComponent message='loading products...'/>
    
    return (//Fragment shorthand <> 
        <>
            <ProductList products={products}/>
        </>
    )
}