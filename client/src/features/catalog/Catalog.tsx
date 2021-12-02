import ProductList from "./ProductList";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import {Grid, Paper} from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";

// radio buttons value match our api params
const sortOptions = [
    {value: 'name', label: 'Alphabetical' },
    {value: 'priceDesc', label: 'Price - High to low' },
    {value: 'price', label: 'Price - Low to high' }
]

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    // each time productsLoaded changes then useEffect is run so for each page load it will be run
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
    
    // metaData cannot be null when passed to AppPagination below
    if(!filtersLoaded) return <LoadingComponent message='loading products...'/>
    
    return (//Fragment shorthand <> 
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={e=> dispatch(setProductParams({orderBy: e.target.value}))}
                      />  
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckBoxButtons 
                        items={brands} 
                        checked={productParams.brands} 
                        onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
                    />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckBoxButtons
                        items={types}
                        checked={productParams.types}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9} >
                <ProductList products={products}/>
            </Grid>   
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb:2}}>
                {metaData && 
                    <AppPagination 
                    metaData={metaData}
                    onPageChange={(page:number)=>dispatch(setPageNumber({pageNumber: page}))}
                />}
            </Grid>
        </Grid>
    )
}