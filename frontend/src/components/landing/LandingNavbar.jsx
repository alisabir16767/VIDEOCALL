import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Stack,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "transparent",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                width: 40,
                height: 40,
              }}
            >
              <VideoCallIcon />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Face Call
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              onClick={() => navigate("/aljk23")}
              startIcon={<PersonIcon />}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Join as Guest
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outlined"
              startIcon={<PersonIcon />}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Register
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                boxShadow: `0 8px 16px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 24px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
}
