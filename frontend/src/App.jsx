import React, { useState, useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import Form from "./Pages/Form";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SplashScreen } from "./Components/SplashScreen";
import Login from "./Pages/Login";
import ProtectedRoute from "./api/protected_routes";

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
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;