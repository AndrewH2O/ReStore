import ProductList from "./ProductList";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {fetchFilters, fetchProductsAsync, productSelectors } from "./catalogSlice";
import {Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";

// radio buttons value match our api params
const sortOptions = [
    {value: 'name', label: 'Alphabetical' },
    {value: 'priceDesc', label: 'Price - High to low' },
    {value: 'price', label: 'Price - Low to high' }
]

// instead of props destructure Props into {products, addProduct}
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types} = useAppSelector(state => state.catalog);
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
                    <FormControl component="fieldset">
                        <RadioGroup>
                            {sortOptions.map(({value, label})=>(
                                <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>
                            ))}    
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <FormGroup>
                        {brands.map(brand => (
                            <FormControlLabel control={<Checkbox/>} label={brand} key={brand} />
                        ))}
                    </FormGroup>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <FormGroup>
                        {types.map(type => (
                            <FormControlLabel control={<Checkbox/>} label={type} key={type} />
                        ))}
                    </FormGroup>
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