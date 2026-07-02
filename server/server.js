import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';


const app = express();

await connectDB()

//Middlewares
app.use(cors())
app.use(express.json())

//Route
app.get('/',(req,res)=> res.send("API is Working"))
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

// port on which server runs
const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log("server is running on PORT" + PORT)
})

export default app;