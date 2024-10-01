import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mongodb from 'mongodb'

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected To DB")
}).catch((e)=>{
    console.log(e)
})

const app = express();

app.listen(3000 , ()=>{
    console.log("Server is Running on a port 3000")
})