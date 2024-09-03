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
import Bookmark from './pages/Bookmark/Bookmark';

import { useSelector, useDispatch } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import { OptStart, loginSuccess, OptFailure, OptSuccess, logout } from './store/slice/userSlice';
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
  // useEffect(() => {
  //   // console.log();
  //   const verifyToken = async () => {
  //     if (location.pathname == "/signup" ||location.pathname == "/login") {
  //       navigate(`${location.pathname}`)
  //     }else {
  //       try {
  //         dispatch(OptStart());

  //         const response = await fetch(VERIFY_TOKEN, {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           credentials: 'include'
  //         });

  //         if (response.ok) {
  //           const result = await response.json();

  //           dispatch(loginSuccess(result))
  //           console.log('Signin successful:', result);
  //           dispatch(OptSuccess())
  //           if (!loading) {

  //             navigate(`${location.pathname}`);
  //           }
  //           console.log("done");

  //         } else {
  //           navigate("/login")
  //           dispatch(OptFailure("error in else App.jsx"))
  //           console.error('login failed:', response);
  //         }
  //       } catch (error) {
  //         dispatch(OptFailure("error in catch App.jsx"))
  //         console.error('An error occurred:', error);
  //       } 
  //     }
  //   }
  //   verifyToken();

  // }, [])
  useEffect(() => {
    const verifyToken = async () => {
      if (location.pathname === "/signup" || location.pathname === "/login") {
        navigate(`${location.pathname}`);
      } else {
        try {
          dispatch(OptStart());

          const response = await fetch(VERIFY_TOKEN, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const result = await response.json();

            dispatch(loginSuccess(result));
            // console.log("Signin successful:", result);
            dispatch(OptSuccess());
            
          } else {
            navigate("/login");
            dispatch(OptFailure("error in else App.jsx"));
            console.error("Login failed:", response);
          }
        } catch (error) {
          navigate("/login");
          dispatch(OptFailure("error in catch App.jsx"));
          console.error("An error occurred:", error);
        }
      }
    };

    verifyToken();
  }, [dispatch, location.pathname, navigate]);

  useEffect(() => {    
    if (!loading && isAuthenticated && user) {
      
    }
  }, [loading, isAuthenticated, user, navigate, location.pathname]);
  return (
    <div >
      {/* <Sidebar /> */}
      
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyTokenUser' element={<LoginPage />} />
        <Route path='/' element={<HomePage toggleSidebar={toggleSidebar} m={isMobile} i={isSidebarVisible}  />} />
        <Route path='/notifications' element={<NotificationPage m={isMobile} i={isSidebarVisible} />} />
        <Route path='/bookmark' element={<Bookmark m={isMobile} i={isSidebarVisible} />} />
        <Route path='/profile/:userName' element={<ProfilePage m={isMobile} i={isSidebarVisible} />} />

      </Routes>
      

    </div>
  );
}

export default App;
