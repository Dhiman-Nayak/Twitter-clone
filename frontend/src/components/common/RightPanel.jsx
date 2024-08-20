import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
// import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import {GET_SUGGESTED_PROFILES} from "../../utils/api/urls.js"

import { useSelector, useDispatch } from 'react-redux';
import { OptStart,OptSuccess, OptFailure } from '../../store/slice/userSlice.js';

const RightPanel = () => {
	const dispatch = useDispatch();
	const isLoading = false;
	const [profiles, setProfiles] = useState([])
	useEffect(() => {
	  
	  getProfileSuggestion();
	}, [])
	const getProfileSuggestion = async ()=>{
		let url = GET_SUGGESTED_PROFILES;
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
				let u = await response.json();
				// setUser(u);
				console.log(u);
				// console.log(user);
				// console.log(user?.followers.length);
				setProfiles(u)
				dispatch(OptSuccess())
			} else {
				dispatch(OptFailure())
				console.error('Getting user profile:', response);
			}
		} catch (error) {
			dispatch(OptFailure(error))
			console.error('An error occurred:', error);
		}
	  }
	return (
		<div className=' lg:block my-4 mx-2 '>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold pb-2 text-xl'>You might Like</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						profiles?.map((user) => (
							<Link
								to={`/profile/${user.userName}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.userName}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => e.preventDefault()}
									>
										Follow
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;