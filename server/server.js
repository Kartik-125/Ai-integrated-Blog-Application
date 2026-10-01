import 'dotenv/config'
import connectDB from './configs/db.js';
import app from './app.js';

// The actual "start this thing for real" entrypoint. Anything with a
// side effect — connecting to the real database, binding a real port —
// lives here, not in app.js, so that importing app.js on its own (as
// tests do) never triggers any of it.

await connectDB()

// port on which server runs
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("server is running on PORT" + PORT)
})