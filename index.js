import express from "express"
import cors from "cors"
import {apiRouter} from "./src/routes.js";

import { leetcodeData } from "./src/leetcode.js";
import { codeforcesData } from "./src/codeforces.js";
import { codechefData } from "./src/codechef.js";
import { gfgData } from "./src/gfg.js";

const app = express();

const PORT = 8000;


app.listen(PORT , ()=>{
    console.log(`Server running on : http://localhost:${PORT}`)
})

app.use(cors({
    origin: 'http://localhost:5173',
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

app.get('/codechef/:username' , codechefData)
app.get('/codeforces/:username' , codeforcesData)
app.get('/leetcode/:username',leetcodeData)
app.get('/gfg/:username' , gfgData)