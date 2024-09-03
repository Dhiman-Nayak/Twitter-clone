import React from 'react'
// import BOOKMARK_POST from "../../utils/api/urls.js"
import Posts from '../../components/common/Posts.jsx'
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../components/common/Sidebar.jsx';
import RightPanel from '../../components/common/RightPanel.jsx';
function Bookmark({i,m}) {

  const {  user } = useSelector((state) => state.user);


  return (
    <div className='flex max-w-6xl mx-auto'>
      {(!m || i) && <Sidebar />}

    <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen relative'>
      <h1 className='m-2 text-xl'>Bookmarks </h1>
      <p className='text-sm text-gray-600 ml-2'>@{user.userName}</p>
      <hr />
      <Posts feedType={"bookmark"}/>
    </div>
    {!m && <RightPanel />}
    </div>
  )
}

export default Bookmark