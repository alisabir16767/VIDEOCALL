import React from "react";
import { Box, Fade, Paper, Typography, useTheme, alpha } from "@mui/material";

export default function Features() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 3,
        mt: 6,
      }}
    >
      {[
        {
          icon: "🎥",
          title: "HD Quality",
          description: "Crystal clear video and audio for a seamless experience",
        },
        {
          icon: "🔒",
          title: "Secure & Private",
          description:
            "End-to-end encryption to keep your conversations private",
        },
        {
          icon: "🚀",
          title: "Instant Join",
          description:
            "No downloads required, join meetings instantly from your browser",
        },
      ].map((feature, index) => (
        <Fade
          in={true}
          style={{ transitionDelay: `${500 + index * 200}ms` }}
          key={index}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 12px 24px ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}`,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              {feature.icon}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Paper>
        </Fade>
      ))}
    </Box>
  );
}
