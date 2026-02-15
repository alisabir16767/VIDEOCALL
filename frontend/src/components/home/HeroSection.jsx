import React from "react";
import { Slide, Paper, Box, Typography, useTheme, alpha } from "@mui/material";

export default function HeroSection() {
  const theme = useTheme();

  return (
    <Slide direction="up" in={true} timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          mb: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3.5rem" },
              mb: 2,
              textShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            Connect Seamlessly
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.9,
              maxWidth: "600px",
              mb: 4,
            }}
          >
            Experience crystal clear video calls with just one click
          </Typography>
        </Box>
      </Paper>
    </Slide>
  );
}
