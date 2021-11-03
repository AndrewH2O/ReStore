import axios, {AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../.."

axios.defaults.baseURL = 'https://localhost:5001/api/';

// we get response data helper
const responseBody = (response: AxiosResponse) => response.data;


axios.interceptors.response.use(response => {
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
    get: (url:string) => axios.get(url).then(responseBody),
    post: (url:string, body:{}) => axios.post(url, body).then(responseBody),
    put: (url:string, body:{}) => axios.put(url, body).then(responseBody),
    delete: (url:string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: ()=>requests.get('products'),
    details: (id:number)=>requests.get(`products/${id}`)
}

// see buggyController to see routes defined
const TestErrors = {
    get400Error:()=>requests.get('buggy/bad-request'),
    get401Error:()=>requests.get('buggy/unauthorised'),
    get404Error:()=>requests.get('buggy/not-found'),
    get500Error:()=>requests.get('buggy/server-error'),
    getValidationError:()=>requests.get('buggy/validation-error')
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;