import React from "react";
import { Box, Typography, Grow, Paper, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";

export default function LandingFeatures({ loaded }) {
  const theme = useTheme();

  const features = [
    {
      icon: <VideoCallIcon sx={{ fontSize: 40 }} />,
      title: "HD Video Calls",
      description:
        "Crystal clear video quality for face-to-face conversations",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Group Meetings",
      description: "Connect with multiple people simultaneously",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure & Private",
      description: "End-to-end encryption for your privacy",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Lightning Fast",
      description: "Instant connections with minimal latency",
    },
  ];

  return (
    <Box sx={{ mb: 12 }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Why Choose Face Call?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Experience the best video calling platform
        </Typography>
      </motion.div>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 4,
        }}
      >
        {features.map((feature, index) => (
          <Grow
            in={loaded}
            key={index}
            style={{ transformOrigin: "0 0 0" }}
            timeout={1000 + index * 200}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 20px 30px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  "& .feature-icon": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
              }}
            >
              <Box
                className="feature-icon"
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                  transition: "transform 0.3s",
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grow>
        ))}
      </Box>
    </Box>
  );
}
