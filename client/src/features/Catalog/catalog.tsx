import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";

interface Props {
    products: Product[];
    addProduct: () => void;
}

// instead of props destructure Props into {products, addProduct}
export default function Catalog({products, addProduct}: Props) {
    return (//Fragment shorthand <> 
        <>
            <List>
                {products.map((product) => (
                    <ListItem key={product.id}>
                        <ListItemAvatar>
                            <Avatar src={product.pictureUrl}/>
                        </ListItemAvatar> 
                        <ListItemText>
                            {product.name} - {product.price}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            <Button variant='contained' onClick={addProduct}>Add product</Button>
        </>
    )
}