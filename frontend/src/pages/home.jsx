import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { Box, Container, Fade, useTheme, alpha } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import JoinPanel from "../components/home/JoinPanel";
import Features from "../components/home/Features";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const theme = useTheme();

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;

    setIsJoining(true);
    try {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    } catch (error) {
      console.error("Failed to join meeting:", error);
      setIsJoining(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            <HeroSection />

            <JoinPanel
              meetingCode={meetingCode}
              setMeetingCode={setMeetingCode}
              handleJoinVideoCall={handleJoinVideoCall}
              isJoining={isJoining}
            />

            <Features />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default withAuth(HomeComponent);
