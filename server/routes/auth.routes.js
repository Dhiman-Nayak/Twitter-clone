import express from "express";
import {signup,login,logout,getMe} from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login)
router.route("/me").get(verifyJWT,getMe)
router.route("/logout").get(logout)



export default router;