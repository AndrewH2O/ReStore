import {Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography }  from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";


export default function ProductDetails() {
    const {id} = useParams<{id: string}>();
    
    // init value is null and type is null rather than undefined
    const [product,setProduct] = useState<Product|null>(null);
    const [loading,setLoading] = useState(true);
    
    useEffect(() => {
        agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error=>console.log(error))
            .finally(()=>setLoading(false))
    },[id])      // dependency id as we sprecify a value then if that changes useEffect triggered again
    
    if(loading) return <LoadingComponent message='Loading product...'/>
    
    if(!product) return <NotFound/>
    
    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider  sx={{mb:2}} />
                <Typography variant='h4' color='secondary'>{(product.price/100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}