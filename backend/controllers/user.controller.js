import express from "express";
import { v2 as cloudinary } from "cloudinary";

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

        

        res.status(200).json({"message":"User unfollowed successfully"})
    }else{
        //follow         
        await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
       
        //for notification
        const newNotification = new Notification({
          type:"follow",
          from: req.user._id,
          to:userToModify._id,
      })
      await newNotification.save();
        res.status(200).json({"message":"User followed successfully"})
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};

const getSuggestedUser=async (req,res)=>{
  try {
    const userId= req.user._id;
    const usersFollowedByMe= await User.findById(userId).select("following")
    const users = await User.aggregate([
      {
        $match:{
          _id:{$ne:userId}
        }
      },
      {$sample:{size:15}}

    ])
    
    const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id))
    const suggestedUser = filteredUsers.slice(0,4)

    suggestedUser.forEach((user)=>(user.password=null))

    res.status(200).json(suggestedUser)
  } catch (error) {
    console.log("Error in getSuggestedUser controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  
  }
}

const updateUser=async (req,res)=>{
try {
  const {fullName,email,bio,link,currentPassword,newPassword} = req.body;
  let {profileImg,coverImg} = req.body;

  const userId = req.user._id;
  let user = await User.findById(userId);
  if(!user){
    return res.status(404).json({ error: "User Not Found" });
  }
  if ((newPassword && !currentPassword) || (currentPassword && !newPassword)) {
    return res.status(400).json({ error: "Please provide both current password and new password" });    
  }
  if (newPassword && currentPassword) {
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Wrong Password" });
      }
  }
  if (profileImg) {
    if (user.profileImg) {
      await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
    }
    const url=await cloudinary.uploader.upload(profileImg);
    profileImg = url.secure_url;
  }
  if (coverImg) {
    if (user.coverImg) {
      await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
    }
    const url=await cloudinary.uploader.upload(coverImg);
    coverImg = url.secure_url;
  }

  user.email= email || user.email;
  user.fullName= fullName || user.fullName;
  user.bio= bio || user.bio;
  user.link= link || user.link;
  user.currentPassword= currentPassword || user.currentPassword;
  user.password= newPassword || user.password;
  user.profileImg= profileImg || user.profileImg;
  user.coverImg= coverImg || user.coverImg;

  user=await user.save();
  user.password=""
  return res.status(200).json(user)

} catch (error) {
  console.log("Error in updateUser controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  
}
}

export { getUserProfile, followUnfollowUser,getSuggestedUser,updateUser };
