import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected To DB")
}).catch((e)=>{
    console.log(e)
})

const app = express();

app.use('/api/user' , userRouter)

app.listen(3000 , ()=>{
    console.log("Server is Running on a port 3000")
})