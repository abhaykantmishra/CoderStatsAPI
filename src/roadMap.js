
import { GoogleGenerativeAI } from "@google/generative-ai";

// console.log(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:"" ,
    });

// const prompt = "Write a story about a magic backpack in 50words.";

// const result = await model.generateContent(prompt);
// // console.log(result.response.text());

async function generateRoadMap(req,res){
    
    try {
        const {prompt} = req.body;
        if(!prompt){
            return res.status(400).json({
                msg:"Please provide a prompt first!"
            })
        }
        const geminiResult = await model.generateContent(prompt);
        const result = geminiResult.response.text()
        // console.log(result.substring(8));
        const ans = result;
        // const ans = await JSON.parse(result);
        // console.log(ans);
        // const ans = JSON.parse(result);
        return res.status(200).json(ans);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
           msg:"Something went wrong while generating roadmap!!"
        })
    }
}

export {
    generateRoadMap,
}
