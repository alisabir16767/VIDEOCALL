import React from "react";
import { Box, Typography, Link, useTheme, alpha } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        textAlign: "center",
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Face Call. All rights reserved.
      </Typography>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 3 }}>
        <Link href="#" color="text.secondary" sx={{ textDecoration: "none" }}>
          Privacy Policy
        </Link>
        <Link href="#" color="text.secondary" sx={{ textDecoration: "none" }}>
          Terms of Service
        </Link>
        <Link href="#" color="text.secondary" sx={{ textDecoration: "none" }}>
          Contact Us
        </Link>
      </Box>
    </Box>
  );
}
