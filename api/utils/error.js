import { stat } from "fs";

export const errorHandler = (message  , statusCode) =>{
    const error = new Error()
    error.statusCode = statusCode   
    error.message = message;
    
    return error 
}