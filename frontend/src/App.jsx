import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeet";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/:url" element={<VideoMeetComponent />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
