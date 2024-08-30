import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {getUserProfile,followUnfollowUser,getSuggestedUser,updateUser} from "../controllers/user.controller.js";


const router = express.Router();

router.route("/profile/:userName").get(verifyJWT, getUserProfile);
router.route("/follow/:id").get(verifyJWT, followUnfollowUser);
router.route("/suggested").get(verifyJWT, getSuggestedUser);
router.route("/update").post(verifyJWT, updateUser);

export default router;
