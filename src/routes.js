import { Router } from "express";
import { leetcodeData } from "./leetcode.js";
import { codeforcesData } from "./codeforces.js";
import { codechefData } from "./codechef.js";
import { gfgData } from "./gfg.js";

const apiRouter = Router();

apiRouter.route('/leetcode/:username').get(leetcodeData);
apiRouter.route('/codeforces/:username').get(codeforcesData);
apiRouter.route("/codechef/:username").get(codechefData)
apiRouter.route('/gfg/:username').get(gfgData);

export { apiRouter };