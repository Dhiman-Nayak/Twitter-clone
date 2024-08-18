import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate ,useLocation} from 'react-router-dom';
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
import { loginStart, loginSuccess, loginFailure, logout } from './store/slice/userSlice';
import useIsMobile from './hooks/UseIsMobile';
import {VERIFY_TOKEN} from "./utils/api/urls";

function App() {
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();  
  // const isSignupRoute = location.pathname === '/signup';
  // const [isLoginRoute, setIsLoginRoute] = useState(location.pathname === '/login')

  const isMobile = useIsMobile();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        dispatch(loginStart());

        const response = await fetch(VERIFY_TOKEN, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();

          console.log('Signin successful:', result);
          navigate("/");
          dispatch(loginSuccess(result))
        } else {
          dispatch(loginFailure(response))
          console.error('Signin failed:', response);
        }
      } catch (error) {
        dispatch(loginFailure(error))
        console.error('An error occurred:', error);
      }
    }
    verifyToken();

  }, [])

  return (
    <div className='flex max-w-6xl mx-auto'>
      {!isMobile && <Sidebar />}
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        {/* <Route path='/' element={<PrivateRoute element={HomePage} />} /> */}
        <Route path='/' element={<HomePage/>} />
        <Route path='/notifications' element={<NotificationPage/>} />
        <Route path='/profile/:userName' element={<ProfilePage/>} />

      </Routes>
      {!isMobile  &&<RightPanel />}
      <Routes>

      </Routes>
    </div>
  );
}

export default App;
