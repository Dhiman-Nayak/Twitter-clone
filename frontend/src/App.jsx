import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

import useIsMobile from './hooks/UseIsMobile';

function App() {


const isMobile = useIsMobile();

  return (
    <div className='flex max-w-6xl mx-auto'>
      {!isMobile &&<Sidebar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:userName' element={<ProfilePage />} />

      </Routes>
      {!isMobile && <RightPanel />}
    </div>
  );
}

export default App;
