import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice.js';

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { GET_PROFILE_USERNAME, GET_USER_POST, FOLLOW_UNFOLLOW } from "../../utils/api/urls.js"

// import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { userName } = useParams()

	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");
	const [userOwner, setuserOwner] = useState(null)
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const [isMyProfile, setIsMyProfile] = useState(true)
	const [isFollowing, setIsFollowing] = useState(false)
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		let timer;
		if (!user) {
			// If user is undefined, set a timer to render the component after 3 seconds
			// console.log("gg");

			setTimeout(() => {
				setShouldRender(true);

			}, 3000);
		} else {
			// If user is defined, render the component immediately
			setShouldRender(true);
		}
		getUserDetails();
		// Cleanup the timer on component unmount
		return () => clearTimeout(timer);
	}, [user]);


	let u = {};
	const getUserDetails = async () => {
		let url = GET_PROFILE_USERNAME + userName;
		try {
			// console.log(url);

			dispatch(OptStart())
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include'
			});

			if (response.ok) {
				u = await response.json();
				// console.log(u);

				setuserOwner(u);
				// console.log(user);
				// while (!user) {
				// 	continue;
				// }
				setIsMyProfile(user._id === u._id);

				setIsFollowing(u.followers.includes(user._id))

				dispatch(OptSuccess())
				
			} else {
				dispatch(OptFailure("error in else ProfilePage.jsx"))
				console.error('Getting user profile:', response);
			}
		} catch (error) {
			dispatch(OptFailure("error in catch ProfilePage.jsx"))
			console.error('An error occurred in ProfilePage:', error);
		}
	}

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleFollowUnfollow = async () => {
		try {
			// console.log(url);
			let url = FOLLOW_UNFOLLOW + userOwner._id;
			dispatch(OptStart())
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include'
			});

			if (response.ok) {
				u = await response.json();
				console.log(u);



				dispatch(OptSuccess())
			} else {
				dispatch(OptFailure("error in else ProfilePage.jsx"))
				console.error('Getting user profile:', response);
			}
		} catch (error) {
			dispatch(OptFailure("error in catch ProfilePage.jsx"))
			console.error('An error occurred in ProfilePage:', error);
		}
	}
	// console.log(userOwner);

	return (
		<>
			{!shouldRender ? <ProfileHeaderSkeleton /> :
				<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
					{/* HEADER */}
					{loading && <ProfileHeaderSkeleton />}
					{!loading && !userOwner &&
						<div className='text-center text-lg mt-4'>
							<div className='flex flex-col gap-2 w-full my-2 p-4'>
								<div className='flex gap-2 items-center'>
									<div className='flex flex-1 gap-1'>
										<div className='flex flex-col gap-1 w-full'>
											<div className='skeleton h-40 w-full relative'>
												<div className='skeleton h-20 w-20 rounded-full border absolute -bottom-10 left-3'></div>
											</div>
											<div className="text-4xl mt-40 font-bold">
												This account doesn't <br />exist
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					}
					<div className='flex flex-col'>
						{!loading && userOwner && (
							<>
								<div className='flex gap-10 px-4 py-2 items-center'>
									<Link to='/'>
										<FaArrowLeft className='w-4 h-4' />
									</Link>
									<div className='flex flex-col'>
										<p className='font-bold text-lg'>{userOwner?.fullName}</p>
										{/* <span className='text-sm text-slate-500'>{POSTS?.length} posts</span> */}
									</div>
								</div>
								{/* COVER IMG */}
								<div className='relative group/cover'>
									<img
										src={userOwner?.coverImg || "banner(1).jpg"}
										className='h-52 w-full object-cover'
										alt='cover image'
									/>
									{isMyProfile && (
										<div
											className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
											onClick={() => coverImgRef.current.click()}
										>
											<MdEdit className='w-5 h-5 text-white' />
										</div>
									)}

									<input
										type='file'
										hidden
										accept="image/*"
										ref={coverImgRef}
										onChange={(e) => handleImgChange(e, "coverImg")}
									/>
									<input
										type='file'
										hidden
										accept="image/*"
										ref={profileImgRef}
										onChange={(e) => handleImgChange(e, "profileImg")}
									/>
									{/* USER AVATAR */}
									<div className='avatar absolute -bottom-16 left-4'>
										<div className='w-32 rounded-full relative group/avatar'>
											<img src={profileImg || userOwner?.profileImg || "/avatar-placeholder.png"} />
											<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
												{isMyProfile && (
													<MdEdit
														className='w-4 h-4 text-white'
														onClick={() => profileImgRef.current.click()}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className='flex justify-end px-4 mt-5'>
									{isMyProfile && <EditProfileModal />}
									{!isMyProfile && (
										<button
											className='btn btn-outline rounded-full btn-sm'
											onClick={handleFollowUnfollow}
										>
											{isFollowing ? <span>Follow</span> : <span>UnFollow</span>}
										</button>
									)}
									{(coverImg || profileImg) && (
										<button
											className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
											onClick={handleFollowUnfollow}
										>
											Update
										</button>
									)}
								</div>

								<div className='flex flex-col gap-4 mt-14 px-4'>
									<div className='flex flex-col'>
										<span className='font-bold text-lg'>{userOwner.fullName}</span>
										<span className='text-sm text-slate-500'>@{userOwner?.userName}</span>
										<span className='text-sm my-1'>{userOwner?.bio}</span>
									</div>

									<div className='flex gap-2 flex-wrap'>
										{userOwner?.link && (
											<div className='flex gap-1 items-center '>
												<>
													<FaLink className='w-3 h-3 text-slate-500' />
													<a
														href=''
														target='_blank'
														rel='noreferrer'
														className='text-sm text-blue-500 hover:underline'
													>

													</a>
												</>
											</div>
										)}
										<div className='flex gap-2 items-center'>
											<IoCalendarOutline className='w-4 h-4 text-slate-500' />
											<span className='text-sm text-slate-500'>Joined {userOwner.createdAt.slice(0, 4)}</span>
										</div>
									</div>
									<div className='flex gap-2'>
										<div className='flex gap-1 items-center'>
											<span className='font-bold text-xs'>{userOwner?.following.length}</span>
											<span className='text-slate-500 text-xs'>Following</span>
										</div>
										<div className='flex gap-1 items-center'>
											<span className='font-bold text-xs'>{userOwner?.followers.length || 0}</span>
											<span className='text-slate-500 text-xs'>Followers</span>
										</div>
									</div>
								</div>
								<div className='flex w-full border-b border-gray-700 mt-4'>
									<div
										className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
										onClick={() => setFeedType("posts")}
									>
										Posts
										{feedType === "posts" && (
											<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
										)}
									</div>
									<div
										className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
										onClick={() => setFeedType("likes")}
									>
										Likes
										{feedType === "likes" && (
											<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
										)}
									</div>
								</div>
							</>
						)}

						<Posts userName={userName} feedType={feedType} />
					</div>
				</div>
			}
		</>
	);
};
export default ProfilePage;