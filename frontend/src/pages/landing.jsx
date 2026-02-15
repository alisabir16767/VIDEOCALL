import React, { useEffect, useState } from "react";
import { Box, Container, useTheme, alpha } from "@mui/material";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        overflowX: "hidden",
      }}
    >
      <LandingNavbar />

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <LandingHero />
        <LandingFeatures loaded={loaded} />
        <LandingCTA />
        <Footer />
      </Container>
    </Box>
  );
}
