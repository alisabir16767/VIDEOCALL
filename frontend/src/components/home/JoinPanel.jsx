import React from "react";
import {
  Zoom,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { motion } from "framer-motion";

export default function JoinPanel({
  meetingCode,
  setMeetingCode,
  handleJoinVideoCall,
  isJoining,
}) {
  const theme = useTheme();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinVideoCall();
    }
  };

  return (
    <Zoom in={true} style={{ transitionDelay: "300ms" }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Left Panel - Join Meeting */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                Join a Meeting
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Enter the meeting code provided by the host to join the video
                call instantly
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  fullWidth
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter meeting code"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MeetingRoomIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    minWidth: "250px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 16px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleJoinVideoCall}
                  disabled={!meetingCode.trim() || isJoining}
                  sx={{
                    px: 4,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    boxShadow: `0 8px 16px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 24px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                    },
                    "&:disabled": {
                      background: alpha(theme.palette.action.disabled, 0.5),
                    },
                  }}
                >
                  {isJoining ? "Joining..." : "Join Now"}
                </Button>
              </Box>

              {/* Quick tips */}
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  ⚡ Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Make sure you have a stable internet connection
                  <br />
                  • Allow camera and microphone access when prompted
                  <br />• Test your audio and video before joining
                </Typography>
              </Box>
            </motion.div>
          </Box>

          {/* Right Panel - Illustration */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Box
                component="img"
                src="/Video Call Illustration.png"
                alt="Video Call Illustration"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))",
                }}
              />
            </motion.div>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
}
