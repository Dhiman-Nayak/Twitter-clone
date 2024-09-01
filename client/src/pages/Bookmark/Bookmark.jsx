import React from 'react'
// import BOOKMARK_POST from "../../utils/api/urls.js"
import Posts from '../../components/common/Posts.jsx'

function Bookmark() {

  const handleBookMarkClick = async ()=>{

  }

  return (
    <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen relative'>
      <Posts feedType={"bookmark"}/>
    </div>
  )
}

export default Bookmark