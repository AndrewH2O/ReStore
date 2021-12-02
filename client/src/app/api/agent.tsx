import axios, {AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../.."
import { PaginatedResponse } from "../models/pagination";

// simulate a delay, js async using a promise
const sleep =() => new Promise(resolve => setTimeout(resolve, 500));


axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

// we get response data helper
const responseBody = (response: AxiosResponse) => response.data;

// all api responses intercepted here
// response header is also available
axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers['pagination']; // needs to be l.c. even though in browser its u.c.
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        console.log(response);
        return response;
    }
    return response;
}, (error: AxiosError) => {
    // destructure some props from error response
    // note ! after response overrides type safety for data and status 
    const {data, status} = error.response!;
    switch (status){
        case 400:
            //validation error can also be a 400
            // shape the errors so that pull out string error msg and add them to an array
            if(data.errors){
                const modelStateErrors: string[]=[];
                for(const key in data.errors){
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            // redirect 
            //history.push('/server-error')
            history.push({
                pathname:'/server-error',
                state:{error: data}
            })
            //toast.error(data.title);
            break; 
        default:
            break;
    }
    // always return error back to client
    return Promise.reject(error.response);
})

const requests = {
    get: (url:string, params?:URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url:string, body:{}) => axios.post(url, body).then(responseBody),
    put: (url:string, body:{}) => axios.put(url, body).then(responseBody),
    delete: (url:string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: (params: URLSearchParams)=>requests.get('products', params),
    details: (id:number)=>requests.get(`products/${id}`),
    fetchFilters: ()=>requests.get('products/filters')
}

// see buggyController to see routes defined
const TestErrors = {
    get400Error:()=>requests.get('buggy/bad-request'),
    get401Error:()=>requests.get('buggy/unauthorised'),
    get404Error:()=>requests.get('buggy/not-found'),
    get500Error:()=>requests.get('buggy/server-error'),
    getValidationError:()=>requests.get('buggy/validation-error')
}

const Basket = {
    get: () => requests.get('basket'),
    // default quantity is 1 so its optional to add it to the card
    addItem: (productId:number, quantity = 1)=> requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem: (productId:number, quantity = 1)=> requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

// add methods here so thay can be called
const agent = {
    Catalog,
    TestErrors,
    Basket
}



export default agent;