import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

export default function LandingCTA() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ mb: 12 }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 2 }}
            >
              Ready to start connecting?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Join thousands of users who trust Face Call for their daily
              conversations.
            </Typography>
            <Button
              onClick={() => navigate("/auth")}
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.main,
                px: 6,
                py: 2,
                borderRadius: 4,
                fontSize: "1.1rem",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: alpha("#fff", 0.9),
                  transform: "scale(1.05)",
                },
              }}
            >
              Start Now
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
