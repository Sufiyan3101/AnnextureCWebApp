import React, { useState, useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import Form from "./Pages/Form";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SplashScreen } from "./Components/SplashScreen";
import Login from "./Pages/Login";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Your animation duration

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
          <Route path="/" element={<Dashboard />} />
          <Route path="/form" element={<Form />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
  )
}
export default App;