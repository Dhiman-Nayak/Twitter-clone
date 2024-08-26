import { useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";

import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice.js';
import { LIKE_UNLIKE_POST ,COMMENT_ON_POST} from "../../utils/api/urls.js"
const Post = ({ post }) => {
	const dispatch = useDispatch();
	const { user,loading } = useSelector((state) => state.user)
	const [comment, setComment] = useState("");
	const [postD, setPostD] = useState(post)
	let checkUserDidLiked = post.likes.includes(user?._id)
	const [isLiked, setIsLiked] = useState(checkUserDidLiked)
	const [likesCount, setLikesCount] = useState(post?.likes.length || 0)
	const postOwner = post.user
	// console.log(postOwner);
	const isMyPost = postOwner._id === user._id;
	// console.log(isMyPost);

	const formattedDate = "1h";

	const isCommenting = false;

	useEffect(() => {
		setIsLiked(post.likes.includes(user._id))
		// setLikesCount(post.likes.length)
		// 	console.log("isLiked updated:", isLiked);
		// console.log("likesCount updated:", likesCount);

	}, [postD.likes, user._id, isLiked])

	const handleDeletePost = () => { };

	const handlePostComment =async (e) => {
		e.preventDefault();
		try {
			let url =COMMENT_ON_POST + post._id ;
			dispatch(OptStart());
            // console.log(formData);
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text:comment}),
				credentials: 'include'
            });
    
            if (response.ok) {
                const result = await response.json();
                
                console.log('comment successful:', result);
				dispatch(OptSuccess())
            } else {
				dispatch(OptFailure("Post.jsx comment else"))
                console.error('Post.jsx comment failed:', response);
            }
        } catch (error) {
			dispatch(OptFailure("Post.jsx comment catch"))
            console.error('An error occurred:', error);
        }
	};

	const handleLikePost = async () => {
		let url = LIKE_UNLIKE_POST + post._id;
		// console.log(url);

		try {

			dispatch(OptStart())
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include'
			});

			if (response.ok) {
				let updatedPost = await response.json();

				setIsLiked(!isLiked);
				setLikesCount(updatedPost.post.likes.length);

				setPostD(updatedPost.post)
				setTimeout(() => {


					console.log(isLiked, postD.likes.length);

				}, 5000)
				dispatch(OptSuccess());
			} else {
				dispatch(OptFailure("yes"))
				console.error('Getting user profile:', response);
			}
		} catch (error) {
			dispatch(OptFailure(error))
			console.error('An error occurred:', error);
		}
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.userName}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "images.jpg"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.userName}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.userName}`}>@{postOwner.userName}</Link>
							<span>·</span>
							<span>{postD.createdAt}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{postD.text}</span>
						{postD.img && (
							<img
								src={postD.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + postD._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{postD.comments?.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${postD._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<button
										className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'
										onClick={() => document.getElementById(`comments_modal${postD._id}`).close()}
									>
										<GiTireIronCross />
									</button>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comment?.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 
											</p>
										)}
										{post.comment?.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "images.jpg"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.userName}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{loading ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								{/* <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span> */}
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{/* {!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaHeart  className='w-4 h-4 cursor-pointer text-pink-500 ' />} */}
								{!isLiked ? (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								) : (
									<FaHeart className='w-4 h-4 cursor-pointer text-pink-500' />
								)}
								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 `}
								>
									{likesCount}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};


export default Post;