import ProductList from "./ProductList";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogSlice";
import {Box, Grid, Pagination, Paper, Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";

// radio buttons value match our api params
const sortOptions = [
    {value: 'name', label: 'Alphabetical' },
    {value: 'priceDesc', label: 'Price - High to low' },
    {value: 'price', label: 'Price - Low to high' }
]

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types, productParams} = useAppSelector(state => state.catalog);
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
    
    if(status.includes('pending')) return <LoadingComponent message='loading products...'/>
    
    return (//Fragment shorthand <> 
        <Grid container spacing={4}>
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
            <Grid item xs={9}>
                <ProductList products={products}/>
            </Grid>   
            <Grid item xs={3}/>
            <Grid item xs={9}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>
                        Displaying 1-6 of 20 items
                    </Typography>
                    <Pagination color='secondary' size='large' count={10} page={2}/>
                </Box>
            </Grid>
        </Grid>
    )
}