import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice.js'; 
// import tweetReducer from './slice/tweetSlice'; 

const store = configureStore({
  reducer: {
    user: userReducer,
    // tweets: tweetReducer,
  },
});

export default store;
