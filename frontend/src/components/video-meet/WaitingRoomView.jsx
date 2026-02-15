import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function WaitingRoomView({ onLeave }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1a1a1a",
        color: "white",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          bgcolor: "#2a2a2a",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <HourglassEmptyIcon
            sx={{ fontSize: 40, color: theme.palette.warning.main }}
          />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Waiting Room
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          The meeting host has let you in the waiting room. Please wait, you will be admitted shortly.
        </Typography>

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} color="warning" />
          <Typography variant="body2" color="warning.main">
            Waiting for host approval...
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          startIcon={<ExitToAppIcon />}
          onClick={onLeave}
          sx={{ mt: 4 }}
        >
          Leave Meeting
        </Button>
      </Paper>
    </Box>
  );
}
