import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useSelector, useDispatch } from 'react-redux';
import { OptStart,OptSuccess, OptFailure } from '../../store/slice/userSlice';

import { GET_USER_POST } from "../../utils/api/urls";
const Posts = () => {
	// console.log(POSTS);
	const dispatch=useDispatch()
	const [post, setPost] = useState([])
	const { userName } = useParams()

	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	useEffect(() => {
	  
		getUserPost();
	}, [])
	
	const getUserPost = async () => {
		let url = GET_USER_POST + userName;
		console.log(url);
		
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
				let u = await response.json();
				console.log(u);
				setPost(u);
				dispatch(OptSuccess())
				console.log(response);
				
			} else {
				dispatch(OptFailure())
				console.error('Signin failed:', response);
			}
		} catch (error) {
			dispatch(OptFailure(error))
			console.error('An error occurred:', error);
		}
	}

	return (
		<>
			{loading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!loading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!loading && POSTS && (
				<div>
					{post.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;