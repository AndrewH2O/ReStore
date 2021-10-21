import {useEffect, useState } from 'react';

function App() {
    const [products, setProducts] = useState([
        {name: 'product1', price: 100.00},
        {name: 'product2', price: 200.00},
    ]);

    useEffect(() => {
        fetch('https://localhost:5001/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
    },[]) // 2nd param, an empty array means the useEffect is called only once, 
    // if there is no 2nd param then useffects run every time a re-render happens
    
    function addProduct() {
        // use spread operator copy prevState and add new item
        // based on previous state name 
        // product1..n  price=i*100
        setProducts(prevState => [...prevState, {
            name: 'product' + (prevState.length + 1), 
            price: (prevState.length * 100) + 100}])
    }
   
    
    return (
        <div>
            <h1>Re-Store</h1>
            <ul>
                {products.map((item, index) => (
                    <li key={index}>{item.name} - {item.price}</li>
                ))}
            </ul>
            <button onClick={addProduct}>Add product</button>
        </div>
    );
}

export default App;
