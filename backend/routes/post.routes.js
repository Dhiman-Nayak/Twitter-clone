import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {createPost,likeUnlikePost,commentOnPost,deletePost} from "../controllers/post.controller.js";


const router = express.Router();

router.route("/create").post(verifyJWT, createPost);
router.route("/like/:id").post(verifyJWT, likeUnlikePost);
router.route("/comment").post(verifyJWT, commentOnPost);
router.route("/").delete(verifyJWT, deletePost);

export default router;