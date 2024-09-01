import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { createPost, likeUnlikePost, commentOnPost, deletePost, getLikedPost, getAllPost, getFollowing, getUserPosts,getPostById ,getAddRemoveBoomark,getBookMarkPost} from "../controllers/post.controller.js";
import {upload} from "../middleware/multer.js"

const router = express.Router();

router.route("/getPost").get(verifyJWT, getAllPost);
router.route("/liked/:id").get(verifyJWT, getLikedPost);
router.route("/create").post(verifyJWT,upload.single("img"), createPost);
router.route("/like/:id").get(verifyJWT, likeUnlikePost);
router.route("/comment/:id").post(verifyJWT, commentOnPost);
router.route("/:id").delete(verifyJWT, deletePost);

router.route("/following").get(verifyJWT, getFollowing);
router.route("/post/:id").get(verifyJWT, getPostById);

router.route("/user/:userName").get(verifyJWT, getUserPosts);
router.route("/dobookmarK/:id").get(verifyJWT, getAddRemoveBoomark);
router.route("/bookmarK").get(verifyJWT, getBookMarkPost);

export default router;
