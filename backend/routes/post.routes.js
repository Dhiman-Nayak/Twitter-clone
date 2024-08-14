import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { createPost, likeUnlikePost, commentOnPost, deletePost, getLikedPost, getAllPost, getFollowing, getUserPosts } from "../controllers/post.controller.js";


const router = express.Router();

router.route("/getPost").get(verifyJWT, getAllPost);
router.route("/liked/:id").get(verifyJWT, getLikedPost);
router.route("/create").post(verifyJWT, createPost);
router.route("/like/:id").post(verifyJWT, likeUnlikePost);
router.route("/comment/:id").post(verifyJWT, commentOnPost);
router.route("/:id").delete(verifyJWT, deletePost);

router.route("/following").get(verifyJWT, getFollowing);

router.route("/user/:userName").get(verifyJWT, getUserPosts);

export default router;
