import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {getUserProfile,followUnfollowUser} from "../controllers/user.controller.js";


const router = express.Router();

router.route("/profile/:userName").get(verifyJWT, getUserProfile);
router.route("/follow/:id").get(verifyJWT, followUnfollowUser);

export default router;
