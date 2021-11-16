import {Container, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import AboutPage from '../../features/about/AboutPage';
import Catalog from '../../features/catalog/Catalog';
import ProductDetails from '../../features/catalog/ProductDetails';
import ContactPage from '../../features/contact/ContactPage';
import HomePage from '../../features/home/HomePage';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';
import ServerError from '../errors/ServerError';
import NotFound from '../errors/NotFound';
import BasketPage from '../../features/basket/BasketPage';
import { useStoreContext } from '../context/StoreContext';
import { getCookie } from '../util/util';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
    // destructure to left side
    const {setBasket} = useStoreContext();
    const [loading,setLoading] = useState(true);
    
    useEffect(()=>{
        const buyerId = getCookie('buyerId');
        if(buyerId) {
            agent.Basket.get()
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(() => setLoading(false))
        } else {
            setLoading(false);
        }
    },[setBasket]) //< 2nd param do we need any dependencies - look in react terminal warns about missing setBasket
    
    const [darkMode, setDarkMode] = useState(false)
    const palleteType = darkMode ? 'dark' : 'light'

    const theme = createTheme({
        palette: {
            mode: palleteType,
            background: {
                default: palleteType === 'light' ? '#eaeaea' : '#121212'
            }
        }
    })

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }
    
    if(loading) return <LoadingComponent message='Initialising app...'/>

    // 'not found' below is default fall through if no other route matches
    // by adding switch we prevent this and make every route exclusive,
    // avoids Not found being displayed everytime
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
            <CssBaseline/>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route exact path='/catalog' component={Catalog}/>
                    <Route path='/catalog/:id' component={ProductDetails}/>
                    <Route path='/about' component={AboutPage}/>
                    <Route path='/contact' component={ContactPage}/>
                    <Route path='/server-error' component={ServerError}/>
                    <Route path='/basket' component={BasketPage}/>
                    <Route component={NotFound}/>
                </Switch>
            </Container>
        </ThemeProvider>

    );
}

export default App;
