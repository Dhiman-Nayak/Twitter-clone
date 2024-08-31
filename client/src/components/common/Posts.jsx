import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice';

import { GET_USER_POST,GET_ALL_POST,FOLLOWING_POST,LIKED_POST} from "../../utils/api/urls";
const Posts = ({feedType,id}) => {
	// console.log(POSTS);
	const dispatch = useDispatch()
	const [post, setPost] = useState([])
	const [updated, setUpdated] = useState(false)
	const { userName } = useParams()

	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	useEffect(() => {

		getUserPost();
	}, [feedType,updated])
	const handleDataFromChild = () => {
		console.log("changed");
		
		setUpdated(prev => !prev);
	  };
	const getUserPost = async () => {
		let url;
		if (userName == undefined) {
			if (feedType ==="following") {
				url = FOLLOWING_POST;
			}else{
				url = GET_ALL_POST;
			}
		}else{
			if (feedType=="likes") {
				url=LIKED_POST+userName
			}else{
				url = GET_USER_POST + userName;
			}
		}
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
				let u = await response.json();
				// console.log(u);
				setPost(u);
				console.log(u);
				
				dispatch(OptSuccess())
				// console.log(response);

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
			{!loading && post?.length === 0 && <p className='mt-4 text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!loading && post && (
				<div>
					{post.map((post) => (
						<Post key={post._id} post={post} handleDataFromChild={handleDataFromChild}/>
					))}
					
				</div>
			)}
		</>
	);
};
export default Posts;