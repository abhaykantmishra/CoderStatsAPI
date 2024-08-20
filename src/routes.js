import { Router } from "express";
import { leetcodeData } from "./leetcode.js";
import { codeforcesData } from "./codeforces.js";

const apiRouter = Router();

apiRouter.route('/leetcode/:username').get(leetcodeData)
apiRouter.route('/codeforces/:username').get(codeforcesData)

export { apiRouter };