import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";

export default function LandingHero() {
  const navigate = useNavigate();
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 4,
        mb: 12,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: 1 }}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            <span style={{ color: "#FF9839" }}>Connect</span> with your
            <br />
            loved Ones
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: "500px",
            }}
          >
            Cover any distance with crystal clear video calls. Stay connected
            with family, friends, and colleagues.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            onClick={() => navigate("/auth")}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 2,
              px: 4,
              fontSize: "1.2rem",
              borderRadius: 3,
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
            Get Started
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Chip
              icon={<GroupsIcon />}
              label="10K+ Users"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <Chip
              icon={<SecurityIcon />}
              label="Secure"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <Chip
              icon={<SpeedIcon />}
              label="Fast"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ flex: 1 }}
      >
        <Box
          component="img"
          src="/mobile.png"
          alt="Video Call Illustration"
          sx={{
            width: "100%",
            maxWidth: "500px",
            height: "auto",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))",
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
      </motion.div>
    </Box>
  );
}
