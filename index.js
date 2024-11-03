import "dotenv/config"
import express from "express"
import cors from "cors"
import {apiRouter} from "./src/routes.js";


const app = express();

const PORT = 8000;


app.listen(PORT , ()=>{
    console.log(`Server running on : http://localhost:${PORT}`)
})

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/api/' , apiRouter);

app.get('/', (req,res) => {
    return res.json({
        msg:"Welcome to homepage of code-api",
        forLeetcode:"/api/leetcode/{username}",
        forCodeforces:"/api/codeforces/{username}",
        forLeetcode : "/api/leetcode/{username}",
    })
})

// app.get('/codechef/:username' , codechefData)
// app.get('/codeforces/:username' , codeforcesData)
// app.get('/leetcode/:username',leetcodeData)
// app.get('/gfg/:username' , gfgData)
