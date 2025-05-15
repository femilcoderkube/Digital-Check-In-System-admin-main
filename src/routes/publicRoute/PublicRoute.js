import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  // const isAuthenticated = localStorage.getItem("token");
   const authToken = localStorage.getItem("token");

   
   const isAuthenticated = !!authToken;


  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
