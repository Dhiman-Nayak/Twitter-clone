import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
// import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { GET_SUGGESTED_PROFILES, FOLLOW_UNFOLLOW } from "../../utils/api/urls.js"

import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice.js';

const RightPanel = () => {
	const dispatch = useDispatch();
	const { user, loading } = useSelector((state) => state.user)
	const [profiles, setProfiles] = useState([])
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {

		getProfileSuggestion();
	}, [])
	const getProfileSuggestion = async () => {
		// if(user){
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
		// }
	}
	const handleFollow = async (e, profileId) => {
		e.preventDefault()

		try {
			// console.log(url);
			let url = FOLLOW_UNFOLLOW + profileId
			dispatch(OptStart())
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include'
			});

			if (response.ok) {
				setIsFollowing(!isFollowing);

				setProfiles(profiles.map(profile =>
					profile._id === profileId
						? { ...profile, isFollowing: !profile.isFollowing }
						: profile
				));
				dispatch(OptSuccess())
			} else {
				dispatch(OptFailure('error in rightpanel'))
				console.error('error in rightpanel', response);
			}
		} catch (error) {
			dispatch(OptFailure('error in rightpanel'))
			console.error('error in rightpanel', error);
		}

	}
	return (
		<div className=' lg:block my-4 mx-2 '>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold pb-2 text-xl'>You might Like</p>
				<div className='flex flex-col gap-4'>

					{loading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!loading &&
						profiles?.map((user) => (
							<div className="flex" key={user._id}>
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
								</Link>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => handleFollow(e, user._id)}
									>
										{user.isFollowing ? 'Following' : 'Follow'}
									</button>
								</div>
							</div>
						))}

				</div>
			</div>
		</div>
	);
};
export default RightPanel;