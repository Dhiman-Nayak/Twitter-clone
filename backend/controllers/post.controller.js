import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

const createPost = async (req, res) => {
    try {

        const { text } = req.body;
        let { img } = req.body;
        console.log(text);

        const userId = req.user._id.toString();
        let user = User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!text && !img) {
            return res.status(404).json({ message: "Post must contain some text or data" })
        }

        if (img) {
            const urll = await cloudinary.uploader.upload(img);
            img = urll.secure_url;
        }
        console.log(img);

        const newPost = new Post({
            user: userId,
            text,
            img: img
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
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const isuserLiked = post.likes.includes(postId.toString());
        console.log(userId, isuserLiked);

        if (isuserLiked) {
            //true -> unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            return res.status(200).json({ error: "post unliked successully" })
        } else {
            post.likes.push(userId);
            await post.save();
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            return res.status(200).json({ error: "post liked successully" })
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({ error: "Text field is empty" })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }
        const comment = { user: userId, text };
        post.comment.push(comment);
        await post.save();

        return res.status(200).json({ post })
    } catch (error) {
        console.log("Error in commentOnPost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }
        if (post.user.toString() != req.user._id.toString()) {
            return res.status(404).json({ error: "You are not authorised to delete this post" })
        }
        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({ error: "post deleted successfully" })

    } catch (error) {
        console.log("Error in deleteUser controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password -email -coverImg -bio -link -updatedAt"
        })
            .populate({
                path: "comment.user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            });

        if (posts.length === 0) {
            return res.status(200).json([])
        }

        return res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getAllPost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const getLikedPost = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let user = User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const likedPost = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password -email -coverImg -bio -link -updatedAt"
        }).populate({
            path: "comment.user",
            select: "-password -email -coverImg -bio -link -updatedAt"
        });

        res.status(200).json(likedPost)
    } catch (error) {
        console.log("Error in getLikedPost controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}

const getUserPosts = async (req, res) => {
    try {

        const { userName } = req.params
        const user = await User.findOne({ userName })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            }).populate({
                path: "comment.user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            })

        return res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });
    }
}

const getFollowing = async (req, res) => {
    try {
        const userId = req.user._id;
        let user = User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const following = user.following;
        const feedPost = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            }).populate({
                path: "comment.user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            });
        res.status(200).js(feedPost)
    } catch (error) {
        console.log("Error in getFollowing controller :", error.message);
        return res.status(500).json({ error: "Internal sever error" });

    }
}
export { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPost, getLikedPost, getFollowing, getUserPosts };