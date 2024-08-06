import express from "express";
import {signup,login,logout} from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login)
router.get("/logout",logout)



export default router;