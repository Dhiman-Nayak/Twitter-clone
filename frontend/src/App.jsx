import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useSelector, useDispatch } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import { OptStart, loginSuccess, OptFailure, logout } from './store/slice/userSlice';
import useIsMobile from './hooks/UseIsMobile';
import { VERIFY_TOKEN } from "./utils/api/urls";

function App() {
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };
  const isMobile = useIsMobile();
  useEffect(() => {
    // console.log();
    const verifyToken = async () => {
      if (location.pathname == "/signup") {
        navigate("/signup")
      } else if (location.pathname == "/login") {
        navigate("/login")
      } else {
        try {
          dispatch(OptStart());

          const response = await fetch(VERIFY_TOKEN, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });

          if (response.ok) {
            const result = await response.json();

            // console.log('Signin successful:', result);
            navigate(`${location.pathname}`);
            dispatch(loginSuccess(result))
          } else {
            navigate("/login")
            dispatch(OptFailure(response))
            console.error('login failed:', response);
          }
        } catch (error) {
          dispatch(OptFailure(error))
          console.error('An error occurred:', error);
        }
      }
    }
    verifyToken();

  }, [])

  return (
    <div className='flex max-w-6xl mx-auto'>
      {/* <Sidebar /> */}
      {/* {!isMobile && <Sidebar />} */}
      {(!isMobile || isSidebarVisible) && <Sidebar />}
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        {/* <Route path='/' element={<PrivateRoute element={HomePage} />} /> */}
        <Route path='/' element={<HomePage toggleSidebar={toggleSidebar} />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:userName' element={<ProfilePage />} />

      </Routes>
      {!isMobile && <RightPanel />}

    </div>
  );
}

export default App;
