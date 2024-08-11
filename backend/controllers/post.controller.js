import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

const createPost = async (req, res) => {
    try {

        const {text } = req.body;
        let {img} = req.body;
        console.log(text);
        
        const userId = req.user._id.toString();
        let user = User.findById(userId);
        if (!user) {
            return res.status(404).json({message:"User not found"})
        }
        if(!text && !img){
            return res.status(404).json({message:"Post must contain some text or data"})
        }

        if (img) {
            const urll=await cloudinary.uploader.upload(img);
            img = urll.secure_url;
        }
        console.log(img);
        
        const newPost = new Post({
            user:userId,
            text,
            img:img
        })
        await newPost.save()
        return res.status(200).json(newPost)
    } catch (error) {
        console.log("Error in createPost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });
    }
}

const likeUnlikePost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in updateUser controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}
const commentOnPost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in updateUser controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const deletePost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in updateUser controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

export { createPost, likeUnlikePost, commentOnPost, deletePost };