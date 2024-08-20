import express from "express"
import cors from "cors"
import {apiRouter} from "./src/routes.js";

const app = express();

const PORT = 8000;


app.listen(PORT , ()=>{
    console.log(`Server running on : http://localhost:${PORT}`)
})

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/api/' , apiRouter);

app.get('/', (req,res) => {
    return res.json({
        msg:"Welcome to homepage of code-api",
        forLeetcode:"/api/leetcode/{username}",
        forCodeforces:"/api/codeforces/{username}"
    })
})