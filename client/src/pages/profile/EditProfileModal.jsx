import { useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice.js';
import { UPDATE_PROFILE } from "../../utils/api/urls.js"
import { MdEdit } from "react-icons/md";

const EditProfileModal = () => {
	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	const dispatch = useDispatch();	
	const [coverImg, setCoverImg] = useState( user.coverImg || "");
	const [profileImg, setProfileImg] = useState(user.profileImg || "");
	const [formData, setFormData] = useState({
		fullName: user.fullName || "",
		userName: user.userName || "",
		email: user.email || "",
		bio: user.bio || "",
		link: user.link || "",
		
	});
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (state === "coverImg") {
					setCoverImg(reader.result);
				} 
				if (state === "profileImg") {
					setProfileImg(reader.result);
				  }};
			reader.readAsDataURL(file);
		}
	};

	const handleEditProfile = async (e) => {
		e.preventDefault();
		const updatedData = {
			...formData,
			coverImg,
			profileImg,
		  };
	  
		console.log(updatedData);
		console.log(profileImg+coverImg);
		
		try {
			dispatch(OptStart());
			// console.log(formData);

			const response = await fetch(UPDATE_PROFILE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData),
				credentials: 'include'
			});

			if (response.ok) {
				const result = await response.json();

				console.log('update', result);
				dispatch(OptSuccess())
			} else {
				dispatch(OptFailure("EditProfile.jsx failed in else"))
				console.error('EditProfileModal failed:', response);
			}
		} catch (error) {
			dispatch(OptFailure("EditProfile.jsx failed in catch"))
			console.error('An error occurred:', error);
		}
	}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							alert("Profile updated successfully");
						}}
					>
						<div className="m-5">
							<div className='w-380 rounded-full relative group/avatar'>
								<img
									src={coverImg || "banner(1).jpg"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>

								<div
									// className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
									className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'
								>
									<MdEdit className='w-5 h-5 text-white'
										onClick={() => coverImgRef.current.click()}
									/>
								</div>
							</div>


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
							<div className='avatar absolute top-40 left-4'>
								<div className='w-32 rounded-full relative group/avatar'>
									<img src={profileImg || "dp1.jpg"} />
									<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
										{/* {isMyProfile && ( */}
										<MdEdit
											className='w-4 h-4 text-white'
											onClick={() => profileImgRef.current.click()}
										/>
										{/* )} */}
									</div>
								</div>
							</div>
						</div>

						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='userName'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.userName}
								name='userName'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>

						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						<button className='btn btn-primary rounded-full btn-sm text-white' onClick={handleEditProfile}>Update</button>
					</form>
				</div >
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog >
		</>
	);
};
export default EditProfileModal;