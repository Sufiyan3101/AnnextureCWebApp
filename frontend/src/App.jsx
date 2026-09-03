import React, { useState, useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import Form from "./Pages/Form";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SplashScreen } from "./Components/SplashScreen";
import Login from "./Pages/Login";
import ProtectedRoute from "./api/protected_routes";
import CreateUser from "./Admin/CreateUser";
import AuthExpiredHandler from "./api/AuthExpiredHandler";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // animation duration

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <SplashScreen />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthExpiredHandler>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthExpiredHandler>
    </BrowserRouter>
  )
}
export default App;