import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import userRouter from "./routes/userRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Just the Express app itself — no env checks, no DB connection, no
// app.listen(). Importing this file has zero side effects, which is
// exactly what makes it safe for tests to import directly: a test can
// exercise real routes/middleware without starting a real server or
// touching the real database.
const app = express();

//Middlewares
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

//Route
app.get('/',(req,res)=> res.send("API is Working"))
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)
app.use("/api/user", userRouter);
app.use("/api/ai", aiRouter);

// Central error handler — must come AFTER all routes, so that any
// error passed to next() from a controller lands here.
app.use(errorHandler);

export default app;