import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        const {img}=req.body
        const userId = req.user._id.toString();
        // console.log(req.body,"***",req.file);
        // const img=undefined;
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the post contains at least text or an image
        // if (!text && !req.file) {
        //     return res.status(400).json({ message: "Post must contain some text or image" });
        // }
        if (!text && !img) {
            return res.status(400).json({ message: "Post must contain some text or image" });
        }

        // If there is an image, upload it to Cloudinary
        let imageUrl = req.file;
        if (img) {
            const uploadResult = await cloudinary.uploader.upload(img);
            imageUrl = uploadResult.secure_url;
        }

        // Create a new post
        const newPost = new Post({
            user: userId,
            text,
            img: imageUrl,
        });

        // Save the new post to the database
        await newPost.save();

        // Return the created post as a response
        return res.status(200).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
    
        
        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const isuserLiked = post.likes.includes(userId.toString());

        if (isuserLiked) {
            //true -> unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            return res.status(200).json({ message: "post unliked successully" ,post})
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
            return res.status(200).json({ message: "post liked successully",post })
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
        // const userId = req.user._id.toString();
        const userName = req.params.id;
        let user =await User.findOne({userName});
        // console.log(user);
        
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
      
      // Correctly using await to wait for the promise to resolve
      let user = await User.findById(userId);  // Missing await keyword
  
      // Checking if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const following = user.following;
  
      // If the user is not following anyone, return an empty array
      if (!following || following.length === 0) {
        return res.status(200).json([]);
      }
  
      const feedPost = await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password -email -coverImg -bio -link -updatedAt"
        })
        .populate({
          path: "comment.user",
          select: "-password -email -coverImg -bio -link -updatedAt"
        })
        .lean();  // Optional: Converts Mongoose documents to plain JS objects for better performance
  
      res.status(200).json(feedPost);
    } catch (error) {
      console.log("Error in getFollowing controller:", error.message);
      return res.status(500).json({ error: "Internal server error" });  // Typo fixed in error message
    }
  };
  

const getNotification = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

const getPostById = async (req,res )=>{
    try {
        const {id} = req.params
        const post = await Post.findById(id).populate({
            path: "user",
            select: "-password -email -coverImg -bio -link -updatedAt -likedPosts "
        })
            .populate({
                path: "comment.user",
                select: "-password -email -coverImg -bio -link -updatedAt"
            });

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }
        return res.status(200).json(post)
    } catch (error) {
        console.log("Error in getPostById controller:", error.message);
      return res.status(500).json({ error: "Internal server error" }); 
    }
}
export { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPost, getLikedPost, getFollowing, getUserPosts,getNotification ,getPostById};

