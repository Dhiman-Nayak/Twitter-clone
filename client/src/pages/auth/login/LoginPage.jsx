import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, loginSuccess, OptFailure } from '../../../store/slice/userSlice.js';
import { SIGN_IN } from "../../../utils/api/urls";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
	const dispatch = useDispatch();
	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);

	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		userName: "",
		password: "",
	});

	const handleSubmit =async (e) => {
		e.preventDefault();
		try {
			dispatch(OptStart());
            // console.log(formData);
    
            const response = await fetch(SIGN_IN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
				credentials: 'include'
            });
    
            if (response.ok) {
                const result = await response.json();
                
                console.log('Signin successful:', result);
				dispatch(loginSuccess(result))
                navigate("/");
            } else {
				dispatch(OptFailure(response))
                console.error('Signin failed:', response);
            }
        } catch (error) {
			dispatch(OptFailure(error))
            console.error('An error occurred:', error);
        }
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='userName'
							name='userName'
							onChange={handleInputChange}
							value={formData.userName}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;