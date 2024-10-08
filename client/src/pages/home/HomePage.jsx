import { useState ,useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, loginSuccess, OptFailure, logout } from '../../store/slice/userSlice.js';
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import useIsMobile from "../../hooks/UseIsMobile";
import { IoReorderThreeSharp } from "react-icons/io5";
import Sidebar from "../../components/common/Sidebar.jsx";
import RightPanel from "../../components/common/RightPanel.jsx";
const HomePage = ({toggleSidebar,i,m} ) => {
	const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const isMobile = useIsMobile();
	const [feedType, setFeedType] = useState("forYou");
	const [postsUpdated, setPostsUpdated] = useState(false);

	const handlePostCreated = () => {
		setPostsUpdated(p=>!p);
	};
	
	return (
		<div className='flex max-w-6xl mx-auto'>
			{(!m || i) && <Sidebar />}
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen relative left-0'>
				<div className='sticky top-0 flex w-full  bg-black  border-b border-gray-700'>

				{isMobile && <IoReorderThreeSharp className="w-7 h-7 rounded-full ml-2 mt-2" onClick={toggleSidebar}/>}
					<div
						className={
							"z-10 flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost onPostCreated={handlePostCreated} />

				{/* POSTS */}
				{/* {feedType=="forYou"?<Posts feedType={feedType}/>:<Posts feedType={feedType}/>} */}
				<Posts feedType={feedType} postsUpdated={postsUpdated}/>
			</div>
			{!m && <RightPanel />}
		</div>
	);
};
export default HomePage;