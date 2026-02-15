import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Button,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
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
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
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
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: { xs: "none", sm: "block" },
            }}
          >
            Apna Video Call
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => navigate("/history")}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            History
          </Button>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            sx={{
              borderColor: alpha(theme.palette.error.main, 0.5),
              color: theme.palette.error.main,
              "&:hover": {
                borderColor: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
