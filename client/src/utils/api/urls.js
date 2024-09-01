const URL = "http://localhost:3000";

// PROFILE ENDPOINTS //
// ------------------//

//PROFILE AUTHENTICATION
export const SIGN_UP = `${URL}/api/auth/signup`;
export const LOG_OUT = `${URL}/api/auth/logout`;
export const SIGN_IN = `${URL}/api/auth/login`;
export const VERIFY_TOKEN = `${URL}/api/auth/me`;
// USER
export const GET_CURRENT_PROFILE = `${URL}/api/auth/me`;
export const GET_SUGGESTED_PROFILES = `${URL}/api/users/suggested`;
export const GET_PROFILE_USERNAME = `${URL}/api/users/profile/`;
export const FOLLOW_UNFOLLOW = `${URL}/api/users/follow/`
export const UPDATE_PROFILE = `${URL}/api/users/update`;

//POST
export const GET_USER_POST = `${URL}/api/posts/user/`;
export const GET_ALL_POST =  `${URL}/api/posts/getPost` ;
export const CREATE_POST =  `${URL}/api/posts/create` ;
export const COMMENT_ON_POST =  `${URL}/api/posts/comment/` ;
export const LIKE_UNLIKE_POST =  `${URL}/api/posts/like/` ;
export const FOLLOWING_POST =  `${URL}/api/posts/following` ;
export const LIKED_POST =  `${URL}/api/posts/liked/` ;//used id
export const DELETE_POST =  `${URL}/api/posts/` ;//POST ID
export const GET_POST_BY_ID =  `${URL}/api/posts/post/` ;//POST ID
export const DO_BOOKMARK =  `${URL}/api/posts/dobookmark/` ;//POST ID
export const BOOKMARK_POST =  `${URL}/api/posts/bookmark/` ;