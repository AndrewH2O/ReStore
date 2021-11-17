import {Add, Delete, Remove} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import {
    Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import {useState} from "react";
import agent from "../../app/api/agent";
import {useStoreContext} from "../../app/context/StoreContext";

export default function BasketPage() {
    // we get basket from store provider (StoreContext) so we delete the code here to get it each time
    const {basket, setBasket, removeItem} = useStoreContext();
    const [loading, setLoading] = useState(false);

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }
    
    function handleRemoveItem(productId: number, quantity: number = 1) {
        setLoading(true);
        agent.Basket.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity)) // removeItem from store
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }


    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {basket.items.map(item => (
                    <TableRow
                        key={item.productId}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row">
                            <Box>
                                <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}}/>
                                <span>{item.name}</span>
                            </Box>
                        </TableCell>
                        <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                        <TableCell align="center">
                            <LoadingButton loading={loading} onClick={()=>handleRemoveItem(item.productId)} color='error'>
                                <Remove/>
                            </LoadingButton>
                            {item.quantity}
                            <LoadingButton loading={loading} onClick={()=>handleAddItem(item.productId)} color='secondary'>
                                <Add/>
                            </LoadingButton>
                        </TableCell>
                        <TableCell align="right">${(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                        <TableCell align="right">
                            <LoadingButton loading={loading} onClick={() => handleRemoveItem(item.productId, item.quantity)}  color='error'>
                                <Delete/>
                            </LoadingButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}