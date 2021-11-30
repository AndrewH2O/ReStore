import ProductList from "./ProductList";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {fetchFilters, fetchProductsAsync, productSelectors } from "./catalogSlice";

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    
    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync())
    }, [dispatch, productsLoaded]) 
    // 2nd param, an empty array means the useEffect is called only once, 
    // if there is no 2nd param then useffects run every time a re-render happens

    // need another useEffect as once productsLoads then if filters is pending then useEffect will run again
    // we get a duplication need to avoid that
    useEffect(()=>{
        if(!filtersLoaded) dispatch(fetchFilters())
    },[dispatch, filtersLoaded])
    
    if(status.includes('pending')) return <LoadingComponent message='loading products...'/>
    
    return (//Fragment shorthand <> 
        <>
            <ProductList products={products}/>
        </>
    )
}