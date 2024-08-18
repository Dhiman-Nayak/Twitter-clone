const URL = "http://localhost:3000";

// PROFILE ENDPOINTS //
// ------------------//

//PROFILE AUTHENTICATION
export const SIGN_UP = `${URL}/api/auth/signup`;
export const LOG_OUT = `${URL}/api/auth/logout`;
export const SIGN_IN = `${URL}/api/auth/login`;
export const VERIFY_TOKEN = `${URL}/api/auth/me`;
// GET PROFILES
export const GET_CURRENT_PROFILE = `${URL}/api/auth/me`;
export const GET_ALL_PROFILES = `${URL}/profile?page=`;
export const GET_PROFILE_USERNAME = `${URL}/api/users/profile/`;

//EDIT PROFILE
export const UPDATE_PROFILE = `${URL}api/users/update`;
export const UPLOAD_AVATAR = `${URL}/profile/upload-avatar`;
