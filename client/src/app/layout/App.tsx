import { Container, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import Catalog from '../../features/Catalog/Catalog';
import { Product } from '../models/product';
import Header from './Header';

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('https://localhost:5001/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
  }, []) // 2nd param, an empty array means the useEffect is called only once, 
  // if there is no 2nd param then useffects run every time a re-render happens

  function addProduct() {
    // use spread operator copy prevState and add new item
    // based on previous state name 
    // product1..n  price=i*100
    setProducts(prevState => [...prevState, {
      id: prevState.length + 101,
      name: 'product' + (prevState.length + 1),
      price: (prevState.length * 100) + 100,
      brand: 'some brand',
      description: 'some descrpn',
      pictureUrl: 'http://picsum.photos/200'
    }])
  }


  return (
    <>
      <CssBaseline />
      <Header />
      <Container>
        <Catalog products={products} addProduct={addProduct} />
      </Container>

    </>

  );
}

export default App;
