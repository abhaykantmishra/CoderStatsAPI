import { Router } from "express";
import userControllers from "./controllers.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.js";

const userRouter = Router();

// Authentication routes (No auth required)
userRouter.route("/register").post(userControllers.createUser);
userRouter.route("/login").post(userControllers.loginUser);

// User profile routes (Auth required for own profile modifications)
userRouter.route("/profile/:userId").get(optionalAuthMiddleware, userControllers.getUserProfile);
userRouter.route("/profile/:userId").patch(authMiddleware, userControllers.updateUser);
userRouter.route("/profile/:userId").delete(authMiddleware, userControllers.deleteUser);

// Password management (Auth required)
userRouter.route("/change-password/:userId").post(authMiddleware, userControllers.updatePassword);

// Account management (Auth required)
userRouter.route("/deactivate/:userId").post(authMiddleware, userControllers.deactivateAccount);

// User listing and search (Optional auth for personalized results)
userRouter.route("/list").get(optionalAuthMiddleware, userControllers.getAllUsers);
userRouter.route("/list/public").get(userControllers.getAllPublicusers);
userRouter.route("/search").get(optionalAuthMiddleware, userControllers.searchUsers);

// Leaderboard (Optional auth)
userRouter.route("/leaderboard").get(optionalAuthMiddleware, userControllers.getLeaderboard);

export default userRouter;