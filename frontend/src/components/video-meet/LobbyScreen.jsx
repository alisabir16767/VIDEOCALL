import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { motion } from "framer-motion";

export default function LobbyScreen({
  username,
  setUsername,
  localVideoRef,
  onConnect,
  videoAvailable,
  audioAvailable,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            maxWidth: 500,
            width: "90%",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Join Meeting
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your name to continue
          </Typography>

          <Box sx={{ mb: 3 }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{
                width: "100%",
                maxHeight: 300,
                borderRadius: 16,
                backgroundColor: "#2a2a2a",
                transform: "scaleX(-1)", // Mirror effect
              }}
            />

            <Box
              sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}
            >
              <Chip
                icon={videoAvailable ? <VideocamIcon /> : <VideocamOffIcon />}
                label={videoAvailable ? "Camera OK" : "Camera Unavailable"}
                color={videoAvailable ? "success" : "error"}
                size="small"
              />
              <Chip
                icon={audioAvailable ? <MicIcon /> : <MicOffIcon />}
                label={audioAvailable ? "Mic OK" : "Mic Unavailable"}
                color={audioAvailable ? "success" : "error"}
                size="small"
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            label="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            onKeyDown={(e) => e.key === "Enter" && onConnect()}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onConnect}
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            }}
          >
            Join Meeting
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
