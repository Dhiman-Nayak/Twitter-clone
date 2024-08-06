import express from "express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

const getUserProfile = async (req,res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id==req.user._id) {
        return res.status(400).json({error:"You can't follow yourself"});
    }
    if(!userToModify || !currentUser){
        return res.status(400).json({error:"User doesn't found"});
    }
    const isFollowing = currentUser.following.includes(id)

    if(isFollowing){
        //unfollow
        await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});

        //for notification
        const newNotification = new Notification({
            type:"follow",
            from:
        })
        
        res.status(200).json({"message":"User unfollowed successfully"})
    }else{
        //follow         
        await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
       
        //for notification
        const newNotification = new Notification({
            type:"follow",
            from: req.user._id,
            
        })
        res.status(200).json({"message":"User followed successfully"})
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};

export { getUserProfile, followUnfollowUser };
