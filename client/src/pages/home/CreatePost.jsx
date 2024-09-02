import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { SnackbarProvider, useSnackbar } from 'notistack';

import { useSelector, useDispatch } from 'react-redux';
import { OptStart, OptSuccess, OptFailure } from '../../store/slice/userSlice.js';
import { CREATE_POST } from "../../utils/api/urls.js"
const CreatePost = ({ onPostCreated }) => {
	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	const dispatch = useDispatch()
	const { enqueueSnackbar } = useSnackbar();

	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);

	const isPending = false;
	const isError = false;

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(img);

		let url = CREATE_POST;
		try {
			// console.log(url);

			dispatch(OptStart())
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text, img }),
				credentials: 'include'
			});

			if (response.ok) {
				let res = await response.json();
				// setUser(u);
				console.log(res);
				// console.log(user);
				// console.log(user?.followers.length);
				onPostCreated();
				dispatch(OptSuccess())
				enqueueSnackbar('Post uploaded successfully', { variant: 'success' });
				setImg(null);
				setText("")
			} else {
				enqueueSnackbar('something went wrong', { variant: 'faliure' });
				dispatch(OptFailure())
				console.error('Getting user profile:', response);
			}
		} catch (error) {
			enqueueSnackbar('something went wrong', { variant: 'faliure' });
			dispatch(OptFailure(error))
			console.error('An error occurred:', error);
		}
		//alert("Post created successfully");
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={user?.profileImg || "images.jpg"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>Something went wrong</div>}
			</form>
		</div>
	);
};
export default CreatePost;