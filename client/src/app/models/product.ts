export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    type?: string; //  ? optional
    brand: string;
    quantityInStock?: number; // ? optional
}