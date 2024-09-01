import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { GoSignOut } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";

import {  useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, loginSuccess, OptFailure, logout } from '../../store/slice/userSlice';
import {LOG_OUT} from "../../utils/api/urls";
import useIsMobile from "../../hooks/UseIsMobile";


const Sidebar = () => {
	const {  user } = useSelector((state) => state.user);
	// console.log(user);
	const isMobile = useIsMobile()
	const dispatch =useDispatch();
	const navigate = useNavigate();
	const handleLogout = async ()=>{
		try {
			// dispatch(OptStart());
    
            const response = await fetch(LOG_OUT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
				credentials: 'include'
            });
    
            if (response.ok) {
                const result = await response.json();
                
                // console.log('Signin successful:', result);
                navigate("/login");
				dispatch(logout())
            } else {
				dispatch(OptFailure(response))
                console.error('Signin failed:', response);
            }
        } catch (error) {
			dispatch(OptFailure(error))
            console.error('An error occurred:', error);
        }

	}
	return (
		<div className=' w-30 max-w-52 z-10'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full '>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${user?.userName}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/bookmark`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<CiBookmark className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Bookmark</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<div
							onClick={handleLogout}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<GoSignOut className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Sign out</span>
						</div>
					</li>
				</ul>
				{user && (
					<Link
						to={`/profile/${user.userName}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300  hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar  md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={user?.profileImg || "images.jpg"} />
							</div>
						</div>
						<div className='flex justify-between flex-1 '>
							{!isMobile && <div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{user?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{user?.userName}</p>
							</div>}
							{/* <BiLogOut className='w-5 h-5 cursor-pointer' /> */}
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;