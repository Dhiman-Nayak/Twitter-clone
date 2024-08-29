import {  useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { OptStart, loginSuccess, OptFailure, OptSuccess } from '../store/slice/userSlice.js';
import { VERIFY_TOKEN } from "../utils/api/urls.js";


const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
export const verifyTokenUser = async () => {
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
                console.log("1-");

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
}