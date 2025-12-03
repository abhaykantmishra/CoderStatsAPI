import { Router } from "express";
import userControllers from "./controllers.js";

const userRouter = Router();

// Authentication routes
userRouter.route("/register").post(userControllers.createUser);
userRouter.route("/login").post(userControllers.loginUser);

// User profile routes
userRouter.route("/profile/:userId").get(userControllers.getUserProfile);
userRouter.route("/profile/:userId").patch(userControllers.updateUser);
userRouter.route("/profile/:userId").delete(userControllers.deleteUser);

// Password management
userRouter.route("/change-password/:userId").post(userControllers.updatePassword);

// Account management
userRouter.route("/deactivate/:userId").post(userControllers.deactivateAccount);

// User listing and search
userRouter.route("/list").get(userControllers.getAllUsers);
userRouter.route("/list/public").get(userControllers.getAllPublicusers);
userRouter.route("/search").get(userControllers.searchUsers);

// Leaderboard
userRouter.route("/leaderboard").get(userControllers.getLeaderboard);

export default userRouter;