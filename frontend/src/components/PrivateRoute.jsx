// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux'; 

// const PrivateRoute = ({ element: Component, ...rest }) => {
//   const isAuthenticated = useSelector(state => state.user.user); 
//   return (
//     <Route
//       {...rest}
//       element={isAuthenticated ? Component : <Navigate to="/login" />}
//     />
//   );
// };

// export default PrivateRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // or useContext for Context API

const PrivateRoute = ({ element: Component, ...rest }) => {
  const {user} = useSelector(state => state.user); 
  const location = useLocation();

  return user ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
