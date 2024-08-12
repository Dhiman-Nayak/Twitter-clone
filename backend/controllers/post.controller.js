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
        const {text} = req.body
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({error:"Text field is empty"})
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({error:"post not found"})            
        }
        const comment = {user:userId,text};
        post.comment.push(comment);
        await post.save();

        return res.status(200).json({post})
    } catch (error) {
        console.log("Error in commentOnPost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const deletePost = async (req, res) => {
    try {
        const post= await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({error:"post not found"})
        }
        if (post.user.toString() != req.user._id.toString()) {
            return res.status(404).json({error:"You are not authorised to delete this post"})            
        }
        if (post.img) {
            const imgId= post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({error:"post deleted successfully"})

    } catch (error) {
        console.log("Error in deleteUser controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

export { createPost, likeUnlikePost, commentOnPost, deletePost };